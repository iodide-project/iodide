import { sendActionToEditor } from "./actions/editor-message-senders";

const initialVariables = new Set(Object.keys(window)); // gives all global variables
initialVariables.add("__core-js_shared__");
initialVariables.add("__SECRET_EMOTION__");
initialVariables.add("IODIDE_EVALUATION_RESULTS");

export function getUserDefinedVariablesFromWindow() {
  return Object.keys(window).filter(g => !initialVariables.has(g));
}

export default () => {
  sendActionToEditor({
    type: "UPDATE_USER_VARIABLES",
    userDefinedVarNames: getUserDefinedVariablesFromWindow()
  });
};
