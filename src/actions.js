import MarkdownIt from 'markdown-it'
import MarkdownItKatex from 'markdown-it-katex'
import MarkdownItAnchor from 'markdown-it-anchor'

import { getCellById } from './notebook-utils'
import {
  addExternalDependency,
  getSelectedCell,
} from './reducers/cell-reducer-utils'

const MD = MarkdownIt({ html: true }) // eslint-disable-line
MD.use(MarkdownItKatex).use(MarkdownItAnchor)

export function importNotebook(newState) {
  return {
    type: 'IMPORT_NOTEBOOK',
    newState,
  }
}

export function exportNotebook(exportAsReport = false) {
  return {
    type: 'EXPORT_NOTEBOOK',
    exportAsReport,
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
  return {
    type: 'CHANGE_CELL_TYPE',
    cellType,
    language,
  }
}


export function appendToEvalHistory(cellId, content) {
  return {
    type: 'APPEND_TO_EVAL_HISTORY',
    cellId,
    content,
  }
}

// note: this function is NOT EXPORTED. It is a private function meant
// to be wrapped by other actions that will configure and dispatch it.
function updateCellProperties(cellId, updatedProperties) {
  return {
    type: 'UPDATE_CELL_PROPERTIES',
    cellId,
    updatedProperties,
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


function evaluateCodeCell(cell) {
  return (dispatch, getState) => {
    const state = getState()
    let output
    let evalStatus
    const code = cell.content
    const languageModule = state.languages[cell.language].module
    const { evaluator } = state.languages[cell.language]

    try {
      output = window[languageModule][evaluator](code)
      evalStatus = 'success'
    } catch (e) {
      output = e
      evalStatus = 'error'
    }
    dispatch(updateCellProperties(
      cell.id,
      {
        value: output,
        rendered: true,
        evalStatus,
      },
    ))
    dispatch(incrementExecutionNumber())
    dispatch(appendToEvalHistory(cell.id, cell.content))
    dispatch(updateUserVariables())
  }
}

function evaluateMarkdownCell(cell) {
  return (dispatch) => {
    dispatch(updateCellProperties(
      cell.id,
      {
        value: MD.render(cell.content),
        rendered: true,
        evalStatus: 'success',
      },
    ))
  }
}

function evaluateResourceCell(cell) {
  return (dispatch, getState) => {
    const externalDependencies = [...getState().externalDependencies]
    const dependencies = cell.content.split('\n').filter(d => d.trim().slice(0, 2) !== '//')
    const newValues = dependencies
      .filter(d => !externalDependencies.includes(d))
      .map(addExternalDependency)

    newValues.forEach((d) => {
      if (!externalDependencies.includes(d.src)) {
        externalDependencies.push(d.src)
      }
    })
    const evalStatus = newValues.map(d => d.status).includes('error') ? 'error' : 'success'
    dispatch(updateCellProperties(
      cell.id,
      {
        value: new Array(...[...cell.value || [], ...newValues]),
        rendered: true,
        evalStatus,
      },
    ))
    if (newValues.length) {
      dispatch(appendToEvalHistory(
        cell.id,
        `// added external dependencies:\n${newValues.map(s => `// ${s.src}`).join('\n')}`,
      ))
    }
    dispatch(incrementExecutionNumber())
    dispatch(updateUserVariables())
  }
}

function evaluateCSSCell(cell) {
  return (dispatch) => {
    dispatch(updateCellProperties(
      cell.id,
      {
        value: cell.content,
        rendered: true,
        evalStatus: 'success',
      },
    ))
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
    if (cell.cellType === 'code') {
      dispatch(evaluateCodeCell(cell))
    } else if (cell.cellType === 'markdown') {
      dispatch(evaluateMarkdownCell(cell))
    } else if (cell.cellType === 'external dependencies') {
      dispatch(evaluateResourceCell(cell))
    } else if (cell.cellType === 'css') {
      dispatch(evaluateCSSCell(cell))
    } else {
      cell.rendered = false
    }
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

export function changeElementType(elementType) {
  return {
    type: 'CHANGE_ELEMENT_TYPE',
    elementType,
  }
}

export function changeDOMElementID(elemID) {
  return {
    type: 'CHANGE_DOM_ELEMENT_ID',
    elemID,
  }
}

export function changeSidePaneMode(mode) {
  return {
    type: 'CHANGE_SIDE_PANE_MODE',
    mode,
  }
}

export function addLanguage(languageId, evaluate, displayName, codeMirrorMode, keybinding) {
  return {
    type: 'ADD_LANGUAGE',
    languageDefinition: {
      languageId,
      evaluate,
      displayName,
      codeMirrorMode,
      keybinding,
    },
  }
}

export function updateAppMessages(message) {
  return {
    type: 'UPDATE_APP_MESSAGES',
    message,
  }
}
