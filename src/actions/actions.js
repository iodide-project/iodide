import CodeMirror from 'codemirror'

import { exportJsmdToString } from '../tools/jsmd-tools'
import { getCellById, isCommandMode } from '../tools/notebook-utils'
import { postActionToEvalFrame } from '../port-to-eval-frame'

import { addChangeLanguageTask } from './task-definitions'

import { getSelectedCell } from '../reducers/cell-reducer-utils'

import { addLanguageKeybinding } from '../keybindings'

import { mirroredStateProperties, mirroredCellProperties } from '../state-schemas/mirrored-state-schema'

import fetchWithCSRFToken from './../shared/fetch-with-csrf-token'

import {
  alignCellTopTo,
  handleCellAndOutputScrolling,
} from './scroll-helpers'

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

    // copy mirrored state props
    const statePathsToUpdate = Object.keys(mirroredStateProperties)
    const stateUpdatesFromEditor = {}
    statePathsToUpdate.forEach((k) => { stateUpdatesFromEditor[k] = importedState[k] })
    // copy mirrored cell props
    const cellPathsToUpdate = Object.keys(mirroredCellProperties)
    // stateUpdatesFromEditor.cells =
    // const updatedCells
    stateUpdatesFromEditor.cells = stateUpdatesFromEditor.cells.map((cell) => {
      const cellOut = {}
      cellPathsToUpdate.forEach((k) => { cellOut[k] = cell[k] })
      return cellOut
    })

    dispatch({
      type: 'UPDATE_EVAL_FRAME_FROM_INITIAL_JSMD',
      stateUpdatesFromEditor,
    })
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

export function changeMode(mode) {
  return {
    type: 'CHANGE_MODE',
    mode,
  }
}

export function setViewMode(viewMode) {
  return (dispatch, getState) => {
    const state = getState()

    if (state.notebookId) {
      // if there is a notebook id, then persist the fact that this is a Report
      // in the url
      const params = (viewMode === 'REPORT_VIEW') ? '?viewMode=report' : ''
      window.history.replaceState({}, '', `/notebooks/${state.notebookId}/${params}`)
    }
    dispatch({
      type: 'SET_VIEW_MODE',
      viewMode,
    })
  }
}

export function updateInputContent(text) {
  return {
    type: 'UPDATE_INPUT_CONTENT',
    content: text,
  }
}


export function changeCellType(cellType, language = 'js') {
  return (dispatch, getState) => {
    if (isCommandMode(getState())
      && (getSelectedCell(getState()).cellType !== cellType
      || getSelectedCell(getState()).language !== language)) {
      dispatch({
        type: 'CHANGE_CELL_TYPE',
        cellType,
        language,
      })
    }
  }
}

export function addLanguage(languageDefinition) {
  return (dispatch) => {
    const {
      keybinding,
      languageId,
      codeMirrorMode,
    } = languageDefinition
    if (keybinding.length === 1 && (typeof keybinding === 'string')) {
      addLanguageKeybinding(
        [keybinding],
        () => dispatch(changeCellType('code', languageId)),
      )
    }
    CodeMirror.requireMode(codeMirrorMode, () => { })
    addChangeLanguageTask(
      languageDefinition.languageId,
      languageDefinition.displayName,
      languageDefinition.keybinding,
    )
    dispatch({
      type: 'ADD_LANGUAGE_TO_EDITOR',
      languageDefinition,
    })
  }
}

// note: this function is NOT EXPORTED. It is a private function meant
// to be wrapped by other actions that will configure and dispatch it.
export function updateCellProperties(cellId, updatedProperties) {
  return {
    type: 'UPDATE_CELL_PROPERTIES',
    cellId,
    updatedProperties,
  }
}

export function evaluateCell(cellId) {
  return (dispatch, getState) => {
    let cell
    if (cellId === undefined) {
      cell = getSelectedCell(getState())
    } else {
      cell = getCellById(getState().cells, cellId)
    }
    // update the cell props in the eval frame
    const cellPathsToUpdate = Object.keys(mirroredCellProperties)
    const evalFrameCell = {}
    cellPathsToUpdate.forEach((k) => { evalFrameCell[k] = cell[k] })
    dispatch(updateCellProperties(cell.id, evalFrameCell))
    // trigger the cell eval
    dispatch({ type: 'TRIGGER_CELL_EVAL_IN_FRAME', cellId: cell.id })
  }
}

export function evaluateAllCells() {
  return (dispatch, getState) => {
    const { cells } = getState()
    let p = Promise.resolve()
    cells.forEach((cell) => {
      if (cell.cellType === 'css' && !cell.skipInRunAll) {
        p = p.then(() => dispatch(evaluateCell(cell.id)))
      }
    })
    cells.forEach((cell) => {
      if (cell.cellType === 'markdown' && !cell.skipInRunAll) {
        p = p.then(() => dispatch(evaluateCell(cell.id)))
      }
    })
    cells.forEach((cell) => {
      if (cell.cellType !== 'markdown' && cell.cellType !== 'css' && !cell.skipInRunAll) {
        p = p.then(() => dispatch(evaluateCell(cell.id)))
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
    content: exportJsmdToString(state),
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
    fetchWithCSRFToken('/api/v1/notebooks/', postRequestOptions)
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

    const notebookInServer = Boolean(state.notebookId)

    if (notebookInServer) {
      const postRequestOptions = getNotebookSaveRequestOptions(state)
      // Update Exisiting Notebook
      fetchWithCSRFToken(`/api/v1/notebooks/${state.notebookId}/revisions/`, postRequestOptions)
        .then(response => response.json())
        .then(() => {
          const message = 'Updated Notebook'
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

export function cellUp() {
  return (dispatch, getState) => {
    dispatch({ type: 'CELL_UP' })
    const targetPxToTopOfFrame = handleCellAndOutputScrolling(getSelectedCell(getState()).id)
    if (getState().scrollingLinked) {
      postActionToEvalFrame({
        type: 'ALIGN_OUTPUT_TO_EDITOR',
        cellId: getSelectedCell(getState()).id,
        pxFromViewportTop: targetPxToTopOfFrame,
      })
    }
  }
}

export function cellDown() {
  return (dispatch, getState) => {
    dispatch({ type: 'CELL_DOWN' })
    const targetPxToTopOfFrame = handleCellAndOutputScrolling(getSelectedCell(getState()).id)
    if (getState().scrollingLinked) {
      postActionToEvalFrame({
        type: 'ALIGN_OUTPUT_TO_EDITOR',
        cellId: getSelectedCell(getState()).id,
        pxFromViewportTop: targetPxToTopOfFrame,
      })
    }
  }
}

export function insertCell(cellType, direction) {
  return {
    type: 'INSERT_CELL',
    cellType,
    direction,
  }
}

export function addCell(cellType) {
  return {
    type: 'ADD_CELL',
    cellType,
  }
}

export function selectCell(
  cellId,
  autoScrollToCell = false,
  pxFromTopOfEvalFrame = undefined,
) {
  return (dispatch, getState) => {
    // first dispatch the change to the store...
    dispatch({
      type: 'SELECT_CELL',
      id: cellId,
    })

    // ...then we'll deal with scrolling

    // NOTE: pxFromTopOfEvalFrame should always be undefined unless this
    // action was fired as a result of a message recieved from the eval frame
    const clickInEvalFrame = pxFromTopOfEvalFrame !== undefined
    const { scrollingLinked } = getState()
    if (clickInEvalFrame && scrollingLinked) {
      // if selectCell triggered by a click in the eval frame,
      // just align editor cell top to value from eval frame
      alignCellTopTo(cellId, pxFromTopOfEvalFrame)
    } else if (!clickInEvalFrame && scrollingLinked) {
      // select cell triggered from within editor; scroll if needed and send msg
      // to eval frame to align
      const targetPxToTopOfFrame = handleCellAndOutputScrolling(cellId, autoScrollToCell)
      postActionToEvalFrame({
        type: 'ALIGN_OUTPUT_TO_EDITOR',
        cellId,
        pxFromViewportTop: targetPxToTopOfFrame,
      })
    } else if (!clickInEvalFrame && !scrollingLinked) {
      // if selectCell initiated in editor, scroll as needed but don't align output
      handleCellAndOutputScrolling(cellId, autoScrollToCell)
    }
    // note that in the 4th case: (clickInEvalFrame && !scrollingLinked)
    // if click came from the eval frame and scrolling not linked,
    // then *no* scrolling is needed.
  }
}

export function deleteCell() {
  return {
    type: 'DELETE_CELL',
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

export function increaseEditorWidth() {
  return {
    type: 'INCREASE_EDITOR_WIDTH',
  }
}

export function decreaseEditorWidth() {
  return {
    type: 'DECREASE_EDITOR_WIDTH',
  }
}

export function changeSidePaneMode(sidePaneMode) {
  return {
    type: 'CHANGE_SIDE_PANE_MODE',
    sidePaneMode,
  }
}

export function changeEditorWidth(widthShift) {
  return {
    type: 'CHANGE_EDITOR_WIDTH',
    widthShift,
  }
}

export function setCellSkipInRunAll(value) {
  return (dispatch, getState) => {
    let setValue = value
    if (setValue === undefined) {
      setValue = !getSelectedCell(getState()).skipInRunAll
    }
    dispatch(updateCellProperties(
      getSelectedCell(getState()).id,
      { skipInRunAll: setValue },
    ))
  }
}

export function saveEnvironment(updateObj, update) {
  return {
    type: 'SAVE_ENVIRONMENT',
    updateObj,
    update,
  }
}

export function highlightCell(cellID, revert = true) {
  return {
    type: 'HIGHLIGHT_CELL',
    id: cellID,
    revert,
  }
}
export function unHighlightCells() {
  return {
    type: 'UNHIGHLIGHT_CELLS',
  }
}
export function multipleCellHighlight(cellID) {
  return {
    type: 'MULTIPLE_CELL_HIGHLIGHT',
    id: cellID,
  }
}
export function cellCopy() {
  return {
    type: 'CELL_COPY',
  }
}
export function cellCut() {
  return {
    type: 'CELL_CUT',
  }
}
export function cellPaste() {
  return {
    type: 'CELL_PASTE',
  }
}
