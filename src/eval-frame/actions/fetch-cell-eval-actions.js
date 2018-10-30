import parseFetchCell from './fetch-cell-parser'
import {
  appendToEvalHistory,
  historyIdGen,
  updateUserVariables,
  // updateCellProperties,
  // updateValueInHistory,
} from './actions'

/*
spec of desired behavior:
- if there are any syntax errors, immediately print them in the console
- if there are no syntax errors, kick off a fetch per valid line
- while loading files, provide updates on status of each

*/
// export async function handleFetches(params) {
// }

const fetchErrorTypesToStrings = {
  MISSING_FETCH_TYPE: 'fetch type not specified',
  INVALID_FETCH_TYPE: 'invalid fetch type',
  INVALID_VARIABLE_NAME: 'invalid variable name',
}
export function syntaxErrorToString(fetchSpec) {
  return {
    text: `Syntax error, ${fetchErrorTypesToStrings[fetchSpec.parsed.error]} in:
    "${fetchSpec.line}"
`,
    id: fetchSpec.id,
  }
}

export function fetchProgressInitialStrings(fetchSpec) {
  return {
    text: `fetching ${fetchSpec.parsed.fetchType} from ${fetchSpec.parsed.filePath}
`,
    id: fetchSpec.id,
  }
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

function setVariableInWindow(variableName, variableValue) {
  window[variableName] = variableValue
}

export async function fetchFileViaEditor(filePath) {
  return filePath
}

function loadScriptFromBlob(blob) {
  // for async script loading from blobs, see:
  // https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const url = URL.createObjectURL(blob)
    script.onload = () => resolve()
    script.onerror = () => reject()
    script.src = url
    document.head.appendChild(script)
  });
}

export async function fetchAndGetContent(fetchSpec, responseType) {
  return fetch(fetchSpec.parsed.filePath)
    .catch(handleErrors)
    .then(response => (response ? response[responseType]() : undefined))
}

export async function fetchAndAssignVariableToWindow(fetchSpec, responseType) {
  const output = await fetchAndGetContent(fetchSpec, responseType)
  if (output !== undefined) {
    setVariableInWindow(fetchSpec.parsed.varName, output)
    return output
  }
  return Promise.reject()
}

async function addCSS(fetchSpec) {
  // remove css if it already present
  document
    .querySelectorAll(`style[data-href='${fetchSpec.parsed.filePath}']`)
    .forEach((linkNode) => {
      linkNode.parentNode.removeChild(linkNode)
    })

  const stylesheet = await fetchAndGetContent(fetchSpec, 'text')
    .then((css) => {
      const style = document.createElement('style')
      style.innerHTML = css
      style.setAttribute('data-href', fetchSpec.parsed.filePath)
      document.head.appendChild(style)
    })
  if (!stylesheet) return Promise.reject()
  return stylesheet
}

export async function handleFetch(fetchSpec) {
  switch (fetchSpec.parsed.fetchType) {
    case 'text': {
      return fetchAndAssignVariableToWindow(fetchSpec, 'text')
    }
    case 'json': {
      return fetchAndAssignVariableToWindow(fetchSpec, 'json')
    }
    case 'blob': {
      return fetchAndAssignVariableToWindow(fetchSpec, 'blob')
    }
    case 'js':
      return fetchAndGetContent(fetchSpec, 'blob')
        .then(loadScriptFromBlob)
        .then(
          () => Promise.resolve('Finish'),
          () => Promise.reject(new Error(`Script load error: ${fetchSpec.parsed.filePath}`)),
        )
    case 'css':
      return addCSS(fetchSpec)
    default:
      return Promise.resolve()
  }
}

export function evaluateFetchCell(cell) {
  return (dispatch) => {
    const historyId = historyIdGen.nextId()
    const cellText = cell.content
    const fetches = parseFetchCell(cellText)
    const syntaxErrors = fetches
      .filter(f => f.parsed.error !== undefined)
      .map(syntaxErrorToString)

    if (syntaxErrors.length > 0) {
      dispatch(appendToEvalHistory(
        cell.id,
        cell.content,
        syntaxErrors,
        { historyId, historyType: 'FETCH_CELL_INFO' },
      ))
      return Promise.resolve()
    }

    const intialProgressStrings = fetches.map(fetchProgressInitialStrings)
    dispatch(appendToEvalHistory(
      cell.id,
      cell.content,
      intialProgressStrings,
      { historyId, historyType: 'FETCH_CELL_INFO' },
    ))

    return Promise.all(fetches.map(handleFetch)).finally(() => {
      dispatch(updateUserVariables())
    })
  }
}


// function evaluateResourceCell(cell) {
//   return (dispatch, getState) => {
//     const externalDependencies = [...getState().externalDependencies]
//     const dependencies = cell.content.split('\n').filter(d => d.trim().slice(0, 2) !== '//')
//     const newValues = dependencies
//       .filter(d => !externalDependencies.includes(d))
//       .map(addExternalDependency)

//     newValues.forEach((d) => {
//       if (!externalDependencies.includes(d.src)) {
//         externalDependencies.push(d.src)
//       }
//     })
//     const evalStatus = newValues.map(d => d.status).includes('error') ? 'ERROR' : 'SUCCESS'
//     dispatch(updateCellProperties(cell.id, { evalStatus }))
//     dispatch(appendToEvalHistory(
//       cell.id,
//       `// added external dependencies:\n${newValues.map(s => `// ${s.src}`).join('\n')}`,
//       new Array(...[...cell.value || [], ...newValues]),
//       { historyType: 'CELL_EVAL_EXTERNAL_RESOURCE' },
//     ))
//     dispatch(updateUserVariables())
//   }
// }
