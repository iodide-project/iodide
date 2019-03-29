import { stateSchema } from "./state-schema";

import { newNotebookFromSchema } from "./state-prototype-from-schema";

function newNotebook() {
  return newNotebookFromSchema(stateSchema);
}

export { newNotebook, stateSchema };
