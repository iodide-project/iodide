import {
  evalFrameStateSchema,
} from '../state-schemas/eval-frame-only-state-schemas'

import {
  newNotebookFromSchema,
} from '../state-schemas/state-prototype-from-schema'


const stateSchema = evalFrameStateSchema

function newNotebook() {
  return newNotebookFromSchema(evalFrameStateSchema)
}

export {
  newNotebook,
  stateSchema,
}
