import { stateSchema } from "./state-schemas/state-schema";

import { newNotebookFromSchema } from "./state-schemas/state-prototype-from-schema";

function newNotebook() {
  return newNotebookFromSchema(stateSchema);
}

export { newNotebook, stateSchema };
