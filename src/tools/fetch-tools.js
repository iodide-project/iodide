import { postMessageToEditor } from '../eval-frame/port-to-editor'

export function handleErrors(err) {
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

const FETCH_RESOLVERS = {}

export function addResolvers(path, resolve, reject) {
  FETCH_RESOLVERS[path] = { resolve, reject }
}

export function getResolvers(path) {
  return FETCH_RESOLVERS[path]
}

export function deleteResolvers(path) {
  delete FETCH_RESOLVERS[path]
}

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
    addResolvers(path, resolve, reject)
    postMessageToEditor('REQUEST_FETCH', { path, fetchType })
  })
}

export function onParentContextFileFetchSuccess(file, path) {
  getResolvers(path).resolve(file)
  deleteResolvers(path)
}

export function onParentContextFileFetchError(reason, path) {
  getResolvers(path).reject(new Error(reason))
  deleteResolvers(path)
}
