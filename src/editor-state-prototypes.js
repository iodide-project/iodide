import { editorStateSchema } from './state-schemas/editor-only-state-schemas'

import { newNotebookFromSchema } from './state-schemas/state-prototype-from-schema'

const stateSchema = editorStateSchema

function newNotebook() {
  return newNotebookFromSchema(editorStateSchema)
}

export {
  newNotebook,
  stateSchema,
}
