// /*  global IODIDE_BUILD_MODE */
import { postActionToEditor } from "../port-to-editor";

function reduceReducers(...reducers) {
  return (previous, current) =>
    reducers.reduce((p, r) => r(p, current), previous);
}

function replaceStateFromEditor(state, action) {
  return action.type === "REPLACE_STATE" ? action.state : state;
}

// this function forwards actions to the editor
// FIXME THIS IS CRITICAL
// for securty reasons, any actions forwarded must be whitelisted
// and verified against schema on the editor side.
const actionForwarder = (state, action) => {
  // FIXME: this try.catch required to allow the eval frame to load properly --
  // because we have circular dependencies in imports, postActionToEditor
  // is not actually initialized when this is called the first time
  try {
    if (action.type !== "REPLACE_STATE") postActionToEditor(action);
  } catch (error) {
    console.log("EVAL FRAME ACTION POST TO EDITOR FAILED");
  }
  return state;
};

export default reduceReducers(replaceStateFromEditor, actionForwarder);
