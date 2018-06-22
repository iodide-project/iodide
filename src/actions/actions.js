import MarkdownIt from 'markdown-it'
import MarkdownItKatex from 'markdown-it-katex'
import MarkdownItAnchor from 'markdown-it-anchor'

import { exportJsmdBundle, titleToHtmlFilename } from '../tools/jsmd-tools'
import { getCellById, isCommandMode } from '../tools/notebook-utils'
import { postMessageToEvalFrame } from '../port-to-eval-frame'

import { getSelectedCell } from '../reducers/cell-reducer-utils'


const MD = MarkdownIt({ html: true })
MD.use(MarkdownItKatex).use(MarkdownItAnchor)

const CodeMirror = require('codemirror') // eslint-disable-line

export function updateAppMessages(messageObj) {
  //     message.when = (new Date()).toString()
  //     message.details, when, message.
  const { message } = messageObj
  let { details, when } = messageObj
  if (when === undefined) when = new Date().toString()
  if (details === undefined) details = message
  return {
    type: 'UPDATE_APP_MESSAGES',
    message: { message, details, when },
  }
}


export function importNotebook(newState) {
  return {
    type: 'IMPORT_NOTEBOOK',
    newState,
  }
}

export function importFromURL(importedState) {
  return (dispatch) => {
    dispatch(importNotebook(importedState))
    dispatch(updateAppMessages({ message: 'Notebook successfully imported from URL.' }))
    return Promise.resolve()
  }
}

export function exportNotebook(exportAsReport = false, exportToClipboard = false) {
  return {
    type: 'EXPORT_NOTEBOOK',
    exportAsReport,
    exportToClipboard,
  }
}

export function saveNotebook(autosave = false) {
  return {
    type: 'SAVE_NOTEBOOK',
    autosave,
  }
}

export function loadNotebook(title) {
  return {
    type: 'LOAD_NOTEBOOK',
    title,
  }
}

export function deleteNotebook(title) {
  return {
    type: 'DELETE_NOTEBOOK',
    title,
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

export function appendToEvalHistory(cellId, content) {
  return {
    type: 'APPEND_TO_EVAL_HISTORY',
    cellId,
    content,
  }
}

export function incrementExecutionNumber() {
  return {
    type: 'INCREMENT_EXECUTION_NUMBER',
  }
}

export function updateUserVariables() {
  return {
    type: 'UPDATE_USER_VARIABLES',
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
    dispatch(updateCellProperties(cell.id, cell))
    postMessageToEvalFrame('TRIGGER_CELL_EVAL', cell.id)
  }
}

export function evaluateAllCells(cells) {
  return (dispatch) => {
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


export function setCellRowCollapsedState(viewMode, rowType, rowOverflow, cellId) {
  return {
    type: 'SET_CELL_ROW_COLLAPSE_STATE',
    viewMode,
    rowType,
    rowOverflow,
    cellId,
  }
}

export function markCellNotRendered() {
  return {
    type: 'MARK_CELL_NOT_RENDERED',
  }
}

function loginSuccess(userData) {
  return (dispatch) => {
    dispatch({
      type: 'LOGIN_SUCCESS',
      userData,
    })
    dispatch(updateAppMessages({ message: 'You are logged in' }))
  }
}

function loginFailure() {
  return (dispatch) => {
    dispatch(updateAppMessages({ message: 'Login Failed' }))
  }
}

export function login() {
  const url = '/auth/github'
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
    fetch('/logout')
      .then(response => response.json())
      .then((json) => {
        if (json.status === 'success') {
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
        <a href="https://iodide-project.github.io/master/?gist=${json.owner.login}/${json.id}" target="_blank"> Runnable notebook</a>`,
        }))
      })
  }
}

export function cellUp() {
  return {
    type: 'CELL_UP',
  }
}

export function cellDown() {
  return {
    type: 'CELL_DOWN',
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

export function selectCell(cellID, scrollToCell = false) {
  return {
    type: 'SELECT_CELL',
    id: cellID,
    scrollToCell,
  }
}

export function deleteCell() {
  return {
    type: 'DELETE_CELL',
  }
}


export function changeSidePaneMode(mode) {
  return {
    type: 'CHANGE_SIDE_PANE_MODE',
    mode,
  }
}

export function changeSidePaneWidth(widthShift) {
  return {
    type: 'CHANGE_SIDE_PANE_WIDTH',
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
