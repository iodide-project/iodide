import { postMessageToEditor } from '../eval-frame/port-to-editor'

function handleErrors(err) {
  throw new Error(err)
}

export const getResponseTypeFromFetchType = (fetchEntry) => {
  if (fetchEntry === 'css') return 'text'
  if (fetchEntry === 'js') return 'blob'
  return fetchEntry
}

export function genericFetch(path, fetchType) {
  const responseType = getResponseTypeFromFetchType(fetchType)
  return fetch(path)
    .then((r) => {
      if (!r.ok) throw new Error(`${r.status} ${r.statusText} (${path})`)
      return r[responseType]()
    })
    .catch(handleErrors)
}

// //////////////////////////////////////////////////////////////
// ///////////////////// eval frame /////////////////////////////
// //////////////////////////////////////////////////////////////

export const errorTypeToString = {
  MISSING_FETCH_TYPE: 'fetch type not specified',
  INVALID_FETCH_TYPE: 'invalid fetch type',
  INVALID_VARIABLE_NAME: 'invalid variable name',
}


export function syntaxErrorToString(fetchInfo) {
  return `Syntax error, ${errorTypeToString[fetchInfo.parsed.error]} in:
      "${fetchInfo.line}"
  `
}

export function successMessage(fetchInfo) {
  const ifVarSet = fetchInfo.parsed.varName ? `\n\t(var ${fetchInfo.parsed.varName})` : ''
  const text = `SUCCESS: ${fetchInfo.parsed.filePath} loaded${ifVarSet}\n\n`
  return { text, id: fetchInfo.id }
}

export function errorMessage(fetchInfo, msg) {
  let firstLine = ''
  if (fetchInfo.parsed.filePath) firstLine = `${fetchInfo.parsed.filePath}\n\t`
  const text = `ERROR: ${firstLine}${msg}\n\n`
  return {
    text, id: fetchInfo.id,
  }
}

export async function fetchFileFromParentContext(path, fetchType) {
  // used in eval frame.
  return new Promise((resolve, reject) => {
    // resolve and reject are handled in port-to-editor.js when
    // the file is received by the editor.
    window.FETCH_RESOLVERS[path] = { resolve, reject }
    postMessageToEditor('REQUEST_FETCH', { path, fetchType })
  })
}

export function onParentContextFileFetchSuccess(file, path) {
  window.FETCH_RESOLVERS[path].resolve(file)
  delete window.FETCH_RESOLVERS[path]
}

export function onParentContextFileFetchError(reason, path) {
  window.FETCH_RESOLVERS[path].reject(new Error(reason))
  delete window.FETCH_RESOLVERS[path]
}
