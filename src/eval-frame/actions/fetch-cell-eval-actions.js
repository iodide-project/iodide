import parseFetchCell from './fetch-cell-parser'
import {
  appendToEvalHistory,
  historyIdGen,
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

function addCss(fetchSpec) {
  // remove css if it already present
  document
    .querySelectorAll(`link[href='${fetchSpec.parsed.filePath}']`)
    .forEach(linkNode => linkNode.parentNode.removeChild(linkNode))

  // add css
  const elem = document.createElement('link')
  elem.rel = 'stylesheet'
  elem.type = 'text/css'
  elem.href = fetchSpec.parsed.filePath
  return Promise.resolve()
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

export async function handleFetch(fetchSpec) {
  switch (fetchSpec.parsed.fetchType) {
    case 'js':
      return fetch(fetchSpec.parsed.filePath)
        .then(handleErrors)
        .then(resp => resp.blob())
        .then(loadScriptFromBlob)
        .then(
          () => Promise.resolve(),
          () => Promise.reject(new Error(`Script load error: ${fetchSpec.parsed.filePath}`)),
        )
    case 'css':
      return addCss(fetchSpec)
    default:
      return Promise.resolve()
  }
}

export function evaluateFetchCell(cell) {
  return (dispatch) => {
    const historyId = historyIdGen.nextId()
    const cellText = cell.content
    const fetches = parseFetchCell(cellText)

    // console.log('fetches', fetches)

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
    // console.log('intialProgressStrings', intialProgressStrings)
    dispatch(appendToEvalHistory(
      cell.id,
      cell.content,
      intialProgressStrings,
      { historyId, historyType: 'FETCH_CELL_INFO' },
    ))

    return Promise.all(fetches.map(handleFetch)).then(
      () => {
        console.log('all resolved')
        return Promise.resolve()
      },
      () => Promise.reject(),
    )
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
