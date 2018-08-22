import {
  newEditorCell,
  newEditorNotebook,
  editorStateSchema,
} from './state-schemas/mirrored-state-schema'

const stateSchema = editorStateSchema

function newCell(cellId, cellType = 'code', language = 'js') {
  return newEditorCell(cellId, cellType, language)
}

function newCellID(cells) {
  return Math.max(-1, ...cells.map(c => c.id)) + 1
}

function newNotebook() {
  return newEditorNotebook()
}

export {
  newCell,
  newCellID,
  newNotebook,
  stateSchema,
}
