import {
  newEvalFrameCell,
  newEvalFrameNotebook,
  evalFrameStateSchema,
} from '../state-schemas/mirrored-state-schema'

const stateSchema = evalFrameStateSchema

function newCell(cellId, cellType = 'code', language = 'js') {
  return newEvalFrameCell(cellId, cellType, language)
}

function newCellID(cells) {
  return Math.max(-1, ...cells.map(c => c.id)) + 1
}

function newNotebook() {
  return newEvalFrameNotebook()
}

export {
  newCell,
  newCellID,
  newNotebook,
  stateSchema,
}
