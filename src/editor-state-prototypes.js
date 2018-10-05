import queryString from 'query-string'

import {
  // newEditorCell,
  // newEditorNotebook,
  editorCellSchema,
  editorStateSchema,
} from './state-schemas/editor-only-state-schemas'

import {
  newCellFromSchema,
  newNotebookFromSchema,
} from './state-schemas/state-prototype-from-schema'

const stateSchema = editorStateSchema

export const paneRatios = [0, 0.33, 0.5, 0.66, 1]

function newCell(cellId, cellType = 'code', language = 'js') {
  return newCellFromSchema(editorCellSchema, cellId, cellType, language)
}

function newCellID(cells) {
  return Math.max(-1, ...cells.map(c => c.id)) + 1
}

function newNotebook() {
  return newNotebookFromSchema(editorStateSchema)
}

function getUrlParams() {
  const queryParams = queryString.parse(window.location.search);
  const report = queryParams.viewMode === 'report'
  return { viewMode: report ? 'REPORT_VIEW' : 'EXPLORE_VIEW' }
}

function getUserData() {
  const userData = document.getElementById('userData')
  if (userData) {
    return { userData: JSON.parse(userData.textContent) }
  }
  return {}
}

function getNotebookInfo() {
  const notebookInfo = document.getElementById('notebookInfo')
  if (notebookInfo) {
    return { notebookInfo: JSON.parse(notebookInfo.textContent) }
  }
  return {}
}

export {
  getUrlParams,
  getUserData,
  getNotebookInfo,
  newCell,
  newCellID,
  newNotebook,
  stateSchema,
}
