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

function newCell(cellId, cellType = 'code', language = 'js') {
  return newCellFromSchema(editorCellSchema, cellId, cellType, language)
}

function newCellID(cells) {
  return Math.max(-1, ...cells.map(c => c.id)) + 1
}

function newNotebook() {
  return newNotebookFromSchema(editorStateSchema)
}

function getUserData() {
  return { userData: window.userData || {} }
}

export {
  getUserData,
  newCell,
  newCellID,
  newNotebook,
  stateSchema,
}
