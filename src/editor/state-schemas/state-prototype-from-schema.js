import _ from "lodash";

export function newNotebookFromSchema(schema) {
  const initialState = {};
  Object.keys(schema.properties).forEach(k => {
    // we must clone object prototypes to avoid creating multiple references
    // to the same actual object
    initialState[k] = _.cloneDeep(schema.properties[k].default);
  });
  return initialState;
}
