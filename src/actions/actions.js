import MarkdownIt from 'markdown-it'
import MarkdownItKatex from 'markdown-it-katex'
import MarkdownItAnchor from 'markdown-it-anchor'

import { getCellById, isCommandMode } from '../tools/notebook-utils'
import { postDispatchToEvalContext, postTypedMessageToEvalContext } from '../tools/message-passing'
import { getSelectedCell } from '../reducers/cell-reducer-utils'


const MD = MarkdownIt({ html: true })
MD.use(MarkdownItKatex).use(MarkdownItAnchor)

const CodeMirror = require('codemirror') // eslint-disable-line


export function temporarilySaveRunningCellID(cellID) {
  return {
    type: 'TEMPORARILY_SAVE_RUNNING_CELL_ID',
    cellID,
  }
}

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

export function enqueueOrPostDispatchToEvalContext(actionToPost) {
  return (dispatch, getState) => {
    console.log('inside enqueueOrPostDispatchToEvalContext')
    if (getState().evalFrameReady) {
      console.log('posting to eval frame:', actionToPost)
      postDispatchToEvalContext(JSON.stringify(actionToPost))
    } else {
      console.log('ADD_TO_EVAL_FRAME_MESSAGE_QUEUE dispatch')
      dispatch({
        type: 'ADD_TO_EVAL_FRAME_MESSAGE_QUEUE',
        actionToPost: JSON.stringify(actionToPost),
      })
    }
  }
}

export function importNotebook(newState) {
  return (dispatch, getState) => {
    console.log('importNotebook')
    dispatch({
      type: 'IMPORT_NOTEBOOK',
      newState,
    })
    dispatch(enqueueOrPostDispatchToEvalContext({
      type: 'UPDATE_CELL_LIST',
      cells: getState().cells,
    }))
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
    // let evaluation
    let cell
    if (cellId === undefined) {
      cell = getSelectedCell(getState())
    } else {
      cell = getCellById(getState().cells, cellId)
    }
    // here is where we should mark a cell as PENDING.
    // console.log(cell)

    postTypedMessageToEvalContext('UPDATE_CELL_AND_EVAL', JSON.stringify(cell))
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
  return (dispatch) => {
    const actionObj = {
      type: 'MARK_CELL_NOT_RENDERED',
    }
    dispatch(enqueueOrPostDispatchToEvalContext(actionObj))
    dispatch(actionObj)
  }
}

export function cellUp() {
  return (dispatch) => {
    const actionObj = {
      type: 'CELL_UP',
    }
    dispatch(enqueueOrPostDispatchToEvalContext(actionObj))
    dispatch(actionObj)
  }
}

export function cellDown() {
  return (dispatch) => {
    const actionObj = {
      type: 'CELL_DOWN',
    }
    dispatch(enqueueOrPostDispatchToEvalContext(actionObj))
    dispatch(actionObj)
  }
}

export function insertCell(cellType, direction) {
  return (dispatch) => {
    const actionObj = {
      type: 'INSERT_CELL',
      cellType,
      direction,
    }
    dispatch(enqueueOrPostDispatchToEvalContext(actionObj))
    dispatch(actionObj)
  }
}

export function addCell(cellType) {
  return (dispatch) => {
    const actionObj = {
      type: 'ADD_CELL',
      cellType,
    }
    dispatch(enqueueOrPostDispatchToEvalContext(actionObj))
    dispatch(actionObj)
  }
}

export function selectCell(cellID, scrollToCell = false) {
  return (dispatch) => {
    const actionObj = {
      type: 'SELECT_CELL',
      id: cellID,
      scrollToCell,
    }
    dispatch(enqueueOrPostDispatchToEvalContext(actionObj))
    dispatch(actionObj)
  }
}

export function deleteCell() {
  return (dispatch) => {
    const actionObj = {
      type: 'DELETE_CELL',
    }
    dispatch(enqueueOrPostDispatchToEvalContext(actionObj))
    dispatch(actionObj)
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
