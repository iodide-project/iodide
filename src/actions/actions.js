import CodeMirror from 'codemirror'
import { getUrlParams, objectToQueryString } from '../tools/query-param-tools'

import { getNotebookID } from '../tools/server-tools'
import { clearAutosave, getAutosaveJsmd, updateAutosave } from '../tools/autosave'

import { fetchWithCSRFTokenAndJSONContent } from './../shared/fetch-with-csrf-token'

import { jsmdParser } from './jsmd-parser'
import { getAllSelections, selectionToChunks, removeDuplicatePluginChunksInSelectionSet } from './jsmd-selection'

export function updateAppMessages(messageObj) {
  const { message } = messageObj
  let { details, when } = messageObj
  if (when === undefined) when = new Date().toString()
  if (details === undefined) details = message
  return {
    type: 'UPDATE_APP_MESSAGES',
    message: { message, details, when },
  }
}

export function updateJsmdContent(text) {
  return (dispatch, getState) => {
    const jsmdChunks = jsmdParser(text)
    const reportChunkTypes = Object
      .keys(getState().languageDefinitions)
      .concat(['md', 'html', 'css'])

    const reportChunks = jsmdChunks
      .filter(c => reportChunkTypes.includes(c.chunkType))
      .map(c => ({
        chunkContent: c.chunkContent,
        chunkType: c.chunkType,
        chunkId: c.chunkId,
        evalFlags: c.evalFlags,
      }))

    dispatch({
      // this dispatch really just forwards to the eval frame
      type: 'UPDATE_MARKDOWN_CHUNKS',
      reportChunks,
    })
    dispatch({
      type: 'UPDATE_JSMD_CONTENT',
      jsmd: text,
      jsmdChunks,
    })
  }
}

export function importNotebook(importedState) {
  return (dispatch, getState) => {
  // note that we need to not trample on evalFrameMessageQueue or
  // evalFrameReady, so we'll copy those from the current state
    const newState = Object.assign({}, importedState)
    newState.evalFrameMessageQueue = getState().evalFrameMessageQueue
    newState.evalFrameReady = getState().evalFrameReady
    dispatch({
      type: 'IMPORT_NOTEBOOK',
      newState,
    })
  }
}

export function importInitialJsmd(importedState) {
  return (dispatch) => {
    dispatch(importNotebook(importedState))
    // whitelist the part of the state in the JSMD that should be
    // pushed to the eval-frame at initialization, and post it over

    // FIXME: the following is a hack to make sure the MD is available
    // in the eval-frame report at start
    dispatch(updateJsmdContent(importedState.jsmd))
  }
}

export function setPreviousAutosave(hasPreviousAutoSave) {
  return {
    type: 'SET_PREVIOUS_AUTOSAVE',
    hasPreviousAutoSave,
  }
}

export function loadAutosave() {
  return (dispatch, getState) => {
    // jsmd, jsmdChunks
    const jsmd = getAutosaveJsmd(getState())
    const jsmdChunks = jsmdParser(jsmd)
    dispatch({
      type: 'REPLACE_NOTEBOOK_CONTENT',
      jsmd,
      jsmdChunks,
    })
    dispatch(setPreviousAutosave(false))
  }
}

export function discardAutosave() {
  return (dispatch, getState) => {
    clearAutosave(getState())
    dispatch(setPreviousAutosave(false))
  }
}

export function toggleWrapInEditors() {
  return { type: 'TOGGLE_WRAP_IN_EDITORS' }
}

export function exportNotebook(exportAsReport = false) {
  return {
    type: 'EXPORT_NOTEBOOK',
    exportAsReport,
  }
}

export function saveNotebook() {
  return {
    type: 'SAVE_NOTEBOOK',
  }
}

export function resetNotebook() {
  return {
    type: 'RESET_NOTEBOOK',
  }
}

export function clearVariables() {
  return {
    type: 'CLEAR_VARIABLES',
  }
}

export function changePageTitle(title) {
  return {
    type: 'CHANGE_PAGE_TITLE',
    title,
  }
}

export function setViewMode(viewMode) {
  return (dispatch, getState) => {
    const state = getState()
    const notebookId = getNotebookID(state)
    if (notebookId) {
      const params = getUrlParams()
      if (viewMode === 'REPORT_VIEW') params.viewMode = 'report'
      else delete params.viewMode
      window.history.replaceState({}, '', `/notebooks/${notebookId}/?${objectToQueryString(params)}`)
    }
    dispatch({
      type: 'SET_VIEW_MODE',
      viewMode,
    })
  }
}

export function addLanguage(languageDefinition) {
  return (dispatch) => {
    const {
      codeMirrorMode,
    } = languageDefinition
    CodeMirror.requireMode(codeMirrorMode, () => { })
    dispatch({
      type: 'ADD_LANGUAGE_TO_EDITOR',
      languageDefinition,
    })
  }
}


export function getChunkContainingLine(jsmdChunks, line) {
  const [activeChunk] = jsmdChunks
    .filter(c => c.startLine <= line && line <= c.endLine)
  return activeChunk
}

function triggerTextInEvalFrame(chunk) {
  return Object.assign({
    type: 'TRIGGER_TEXT_EVAL_IN_FRAME',
    evalText: chunk.chunkContent,
    evalType: chunk.chunkType,
    evalFrags: chunk.evalFlags,
    chunkId: chunk.chunkId,
  })
}


export function evaluateText() {
  return (dispatch, getState) => {
    const { jsmdChunks } = getState()
    const cm = window.ACTIVE_CODEMIRROR
    const doc = cm.getDoc()
    let actionObj
    if (!doc.somethingSelected()) {
      const { line } = doc.getCursor()
      const activeChunk = getChunkContainingLine(jsmdChunks, line)
      actionObj = triggerTextInEvalFrame(activeChunk)
    } else {
      const selectionChunkSet = getAllSelections(doc)
        .map(selection =>
          selectionToChunks(selection, jsmdChunks, doc))
        .map(removeDuplicatePluginChunksInSelectionSet())
      return Promise.all(selectionChunkSet.map(selection => Promise.all(selection.map(chunk =>
        Promise.resolve(dispatch(triggerTextInEvalFrame(chunk)))))))
    }
    // here's where we'll put: if kernelState === ready
    return Promise.resolve(dispatch(actionObj))
  }
}

export function moveCursorToNextChunk() {
  return (dispatch, getState) => {
    const cm = window.ACTIVE_CODEMIRROR
    const doc = cm.getDoc()
    let targetLine

    if (!doc.somethingSelected()) {
      targetLine = doc.getCursor().line
    } else {
      const selections = doc.listSelections()
      const lastSelection = selections[selections.length - 1]
      targetLine = Math.max(lastSelection.anchor.line, lastSelection.anchor.line)
    }
    const targetChunk = getChunkContainingLine(getState().jsmdChunks, targetLine)
    cm.setCursor(targetChunk.endLine + 1, 0)
  }
}

export function evaluateNotebook() {
  return (dispatch, getState) => {
    const { jsmdChunks } = getState()
    let p = Promise.resolve()
    jsmdChunks.forEach((chunk) => {
      if (!['md', 'css'].includes(chunk.chunkType)) {
        p = p.then(() => dispatch(triggerTextInEvalFrame(chunk)))
      }
    })
  }
}

export function loginSuccess(userData) {
  return (dispatch) => {
    dispatch({
      type: 'LOGIN_SUCCESS',
      userData,
    })
    dispatch(updateAppMessages({ message: 'You are logged in' }))
  }
}

export function loginFailure() {
  return (dispatch) => {
    dispatch(updateAppMessages({ message: 'Login Failed' }))
  }
}

export function login(successCallback, failCallback) {
  const url = '/oauth/login/github'
  const name = 'github_login'
  const specs = 'width=500,height=600'
  const authWindow = window.open(url, name, specs)
  authWindow.focus()
  return (dispatch) => {
    // Functions to be called by child window
    window.loginSuccess = (userData) => {
      dispatch(loginSuccess(userData))
      if (successCallback) successCallback(userData)
    }
    window.loginFailure = () => {
      dispatch(loginFailure())
      if (failCallback) failCallback()
    }
  }
}
export function logout() {
  return (dispatch) => {
    fetch('/logout/')
      .then((response) => {
        if (response.ok) {
          dispatch({ type: 'LOGOUT' })
          dispatch(updateAppMessages({ message: 'Logged Out' }))
        } else dispatch(updateAppMessages({ message: 'Logout Failed' }))
      })
  }
}

function getNotebookSaveRequestOptions(state, options = undefined) {
  const data = {
    title: state.title,
    content: state.jsmd,
  }
  if (options && options.forkedFrom !== undefined) data.forked_from = options.forkedFrom
  const postRequestOptions = {
    body: JSON.stringify(data),
    method: 'POST',
  }

  return postRequestOptions
}

export function createNewNotebookOnServer(options = { forkedFrom: undefined }) {
  return (dispatch, getState) => {
    const state = getState()
    const postRequestOptions = getNotebookSaveRequestOptions(
      state,
      { forkedFrom: options.forkedFrom },
    )
    fetchWithCSRFTokenAndJSONContent('/api/v1/notebooks/', postRequestOptions)
      .then(response => response.json())
      .then((json) => {
        const message = 'Notebook saved to server'
        dispatch(updateAppMessages({
          message,
          details: `${message} <br />Notebook saved`,
        }))
        dispatch({ type: 'ADD_NOTEBOOK_ID', id: json.id })
        window.history.replaceState({}, '', `/notebooks/${json.id}`)
        dispatch({ type: 'NOTEBOOK_SAVED' })
      })
  }
}

export function saveNotebookToServer() {
  return (dispatch, getState) => {
    const state = getState()
    const notebookId = getNotebookID(state)
    const notebookInServer = Boolean(notebookId)
    if (notebookInServer) {
      const postRequestOptions = getNotebookSaveRequestOptions(state)
      // Update Exisiting Notebook
      fetchWithCSRFTokenAndJSONContent(`/api/v1/notebooks/${notebookId}/revisions/`, postRequestOptions)
        .then(response => response.json())
        .then(() => {
          const message = 'Updated Notebook'
          updateAutosave(state, true)
          dispatch(updateAppMessages({
            message,
            details: `${message} <br />Notebook saved`,
          }))
        })
      dispatch({ type: 'NOTEBOOK_SAVED' })
    } else {
      createNewNotebookOnServer()(dispatch, getState)
    }
  }
}

export function setModalState(modalState) {
  return {
    type: 'SET_MODAL_STATE',
    modalState,
  }
}

export function updateNotebookInfo(notebookInfo) {
  return {
    type: 'UPDATE_NOTEBOOK_INFO',
    notebookInfo,
  }
}

export function toggleHelpModal() {
  return (dispatch, getState) => {
    const modalState = getState().modalState === 'HELP_MODAL' ? 'MODALS_CLOSED' : 'HELP_MODAL'
    dispatch(setModalState(modalState))
  }
}

export function toggleEditorLink() {
  return {
    type: 'TOGGLE_EDITOR_LINK',
  }
}

export function saveEnvironment(updateObj, update) {
  return {
    type: 'SAVE_ENVIRONMENT',
    updateObj,
    update,
  }
}

