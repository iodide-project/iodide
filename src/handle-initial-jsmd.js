import { stateFromJsmd } from './tools/jsmd-tools'
import { getStateFromJsmdQueryParams, getUrlParams, JSMD_QUERY_PARAMS } from './tools/query-param-tools'
import { updateAppMessages, importInitialJsmd } from './actions/actions'
import { getNotebookInfoFromDocument } from './tools/server-tools'

export default async function handleInitialJsmd(store) {
  let state
  let notebookImportedFromUrl = false
  const urlParams = getUrlParams()
  const jsmdURLPresent = Object.keys(urlParams).some(param => JSMD_QUERY_PARAMS.has(param))
  const notebookInfo = getNotebookInfoFromDocument() || undefined
  if (jsmdURLPresent && notebookInfo) {
    const newState = await getStateFromJsmdQueryParams()
    if (newState !== undefined) {
      state = newState
      notebookImportedFromUrl = true
    }
  } else {
    // if there is no query string, attempt to parse jsmd from html
    const jsmdElt = document.getElementById('jsmd')
    if (jsmdElt &&
        jsmdElt.innerHTML &&
        jsmdElt.innerHTML.trim() !== '') {
      state = stateFromJsmd(jsmdElt.innerHTML)
    }
  }
  if (state !== undefined) {
    store.dispatch(importInitialJsmd(state))
    if (notebookImportedFromUrl) {
      store.dispatch(updateAppMessages({ message: 'Notebook imported from URL.' }))
    }
  }
}
