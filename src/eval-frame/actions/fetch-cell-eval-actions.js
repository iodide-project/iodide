import parseFetchCell from './fetch-cell-parser'
import {
  appendToEvalHistory,
  updateValueInHistory,
  historyIdGen,
  updateUserVariables,
  // updateCellProperties,
  // updateValueInHistory,
} from './actions'

import { genericFetch as fetchLocally,
  fetchFileFromParentContext,
  syntaxErrorToString,
  successMessage,
  errorMessage } from '../../tools/fetch-tools'

/*
spec of desired behavior:
- if there are any syntax errors, immediately print them in the console
- if there are no syntax errors, kick off a fetch per valid line
- while loading files, provide updates on status of each

*/
// export async function handleFetches(params) {
// }


export function fetchProgressInitialStrings(fetchInfo) {
  let text
  if (fetchInfo.parsed.error) text = `${syntaxErrorToString(fetchInfo)}\n`
  else text = `fetching ${fetchInfo.parsed.fetchType} from ${fetchInfo.parsed.filePath}\n\n`
  return {
    text,
    id: fetchInfo.id,
  }
}

function setVariableInWindow(variableName, variableValue) {
  window[variableName] = variableValue
}

function loadScriptFromBlob(blob) {
  // for async script loading from blobs, see:
  // https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const url = URL.createObjectURL(blob)
    script.onload = () => resolve(`scripted loaded from ${blob}`)
    script.onerror = err => reject(new Error(err))
    script.src = url
    document.head.appendChild(script)
  });
}

async function addCSS(stylesheet, fetchSpec) {
  document
    .querySelectorAll(`style[data-href='${fetchSpec.parsed.filePath}']`)
    .forEach((linkNode) => {
      linkNode.parentNode.removeChild(linkNode)
    })

  const style = document.createElement('style')
  style.innerHTML = stylesheet
  style.setAttribute('data-href', fetchSpec.parsed.filePath)
  document.head.appendChild(style)
  return stylesheet
}

export async function handleFetch(fetchInfo) {
  if (fetchInfo.parsed.error !== undefined) {
    return Promise.resolve(errorMessage(fetchInfo, syntaxErrorToString(fetchInfo)))
  }

  const { filePath, fetchType, isRelPath } = fetchInfo.parsed
  // the following for text, json, blob, css
  let fetchedFile
  const fileFetcher = isRelPath ? fetchFileFromParentContext : fetchLocally
  try {
    fetchedFile = await fileFetcher(filePath, fetchType)
  } catch (err) {
    return Promise.resolve(errorMessage(fetchInfo, err.message))
  }

  const assignVariable = (params, file) => setVariableInWindow(params.parsed.varName, file)

  if (['text', 'json', 'blob'].includes(fetchType)) {
    assignVariable(fetchInfo, fetchedFile)
  } else if (fetchType === 'js') {
    let scriptLoaded
    try {
      scriptLoaded = await loadScriptFromBlob(fetchedFile)
    } catch (err) {
      return Promise.resolve(errorMessage(fetchInfo, err.message))
    }
    return Promise.resolve(successMessage(fetchInfo, scriptLoaded))
  } else if (fetchType === 'css') {
    addCSS(fetchedFile, fetchInfo)
  } else {
    return Promise.resolve(errorMessage(fetchInfo, 'unknown fetch type'))
  }
  return Promise.resolve(successMessage(fetchInfo))
}

export function evaluateFetchCell(cell) {
  return (dispatch) => {
    const historyId = historyIdGen.nextId()
    const cellText = cell.content
    const fetches = parseFetchCell(cellText)

    const initialProgressStrings = fetches.map(fetchProgressInitialStrings)
    dispatch(appendToEvalHistory(
      cell.id,
      cell.content,
      initialProgressStrings,
      { historyId, historyType: 'FETCH_CELL_INFO' },
    ))

    return Promise.all(fetches.map(handleFetch)).then((outcome) => {
      dispatch(updateValueInHistory(historyId, outcome))
    }).finally(() => {
      dispatch(updateUserVariables())
    })
  }
}
