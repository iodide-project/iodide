import CodeMirror from 'codemirror'

import { exportJsmdBundle, titleToHtmlFilename } from '../tools/jsmd-tools'
import { getCellById, isCommandMode } from '../tools/notebook-utils'
import { postActionToEvalFrame } from '../port-to-eval-frame'

import { getSelectedCell } from '../reducers/cell-reducer-utils'

import { addLanguageKeybinding } from '../keybindings'

import { mirroredStateProperties, mirroredCellProperties } from '../state-schemas/mirrored-state-schema'

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

export function newNotebook() {
  return {
    type: 'NEW_NOTEBOOK',
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
  return {
    type: 'SET_VIEW_MODE',
    viewMode,
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
    if (isCommandMode(getState())) {
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

export function login() {
  const url = '/oauth/login/github'
  const name = 'github_login'
  const specs = 'width=500,height=600'
  const authWindow = window.open(url, name, specs)
  authWindow.focus()

  return (dispatch) => {
    // Functions to be called by child window
    window.loginSuccess = (userData) => {
      dispatch(loginSuccess(userData))
    }
    window.loginFailure = () => dispatch(loginFailure())
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

export function exportGist() {
  // Go through all gist of the user
  // Match the discription and fileName for each gist
  // If mactch found, update it
  // If none found then create a new Gist
  const API_ROUTE = 'https://api.github.com'
  return (dispatch, getState) => {
    const state = getState()
    const filename = titleToHtmlFilename(state.title)
    let matchDescription
    let gistCreated = false
    const gistData = {
      description: state.title,
      public: true,
      files: {
        [filename]: { content: exportJsmdBundle(state) },
      },
    };
    fetch(`${API_ROUTE}/gists?access_token=${state.userData.accessToken}`)
      .then(response => response.json())
      .then((json) => {
        matchDescription = json.filter(gist =>
          gist.description === gistData.description &&
          Object.keys(gist.files).length === 1 &&
          Object.keys(gist.files)[0] === filename)

        if (!matchDescription.length) {
          return fetch(`${API_ROUTE}/gists?access_token=${state.userData.accessToken}`, {
            body: JSON.stringify(gistData),
            method: 'POST',
          })
        }
        gistCreated = true
        const gistID = matchDescription[0].id
        return fetch(`${API_ROUTE}/gists/${gistID}?access_token=${state.userData.accessToken}`, {
          body: JSON.stringify(gistData),
          method: 'PATCH',
        })
      })
      .then(response => response.json())
      .then((json) => {
        const message = gistCreated ? 'Updated Gist' : 'Exported to GitHub Gist'
        dispatch(updateAppMessages({
          message,
          details: `${message}<br /><a href="${json.html_url}" target="_blank">Gist</a> -
        <a href="https://iodide.io/stable/?gist=${json.owner.login}/${json.id}" target="_blank"> Runnable notebook</a>`,
        }))
      })
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

export function toggleHelpModal() {
  return {
    type: 'TOGGLE_HELP_MODAL',
  }
}

export function toggleEditorLink() {
  return {
    type: 'TOGGLE_EDITOR_LINK',
  }
}

export function changeSidePaneMode(mode) {
  return {
    type: 'CHANGE_SIDE_PANE_MODE',
    mode,
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
