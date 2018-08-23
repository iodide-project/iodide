import {
  evalFrameCellSchema,
  evalFrameStateSchema,
} from '../state-schemas/eval-frame-only-state-schemas'

import {
  newCellFromSchema,
  newNotebookFromSchema,
} from '../state-schemas/state-prototype-from-schema'


const stateSchema = evalFrameStateSchema

function newCell(cellId, cellType = 'code', language = 'js') {
  return newCellFromSchema(evalFrameCellSchema, cellId, cellType, language)
}

function newCellID(cells) {
  return Math.max(-1, ...cells.map(c => c.id)) + 1
}

function newNotebook() {
  return newNotebookFromSchema(evalFrameStateSchema)
}

export {
  newCell,
  newCellID,
  newNotebook,
  stateSchema,
}
