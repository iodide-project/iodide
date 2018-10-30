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

// export async function handleFetch(fetchSpec) {
//   if (fetchSpec.error) {
//   }
// }

export async function requestFileViaEditor(filePath) {
  return filePath
}

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


export function evaluateFetchCell(cell) {
  return (dispatch) => {
    const historyId = historyIdGen.nextId()
    const cellText = cell.content
    const fetches = parseFetchCell(cellText)

    console.log('fetches', fetches)

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
    } else {
      const intialProgressStrings = fetches.map(fetchProgressInitialStrings)
      console.log('intialProgressStrings', intialProgressStrings)
      dispatch(appendToEvalHistory(
        cell.id,
        cell.content,
        intialProgressStrings,
        { historyId, historyType: 'FETCH_CELL_INFO' },
      ))
      // intialProgressStrings
    }
    // let fetchResults = Promise.all(fetches.map(handleFetch))
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
