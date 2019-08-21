import notebookReducer from "./notebook-reducer";

import evalFrameActionReducer from "./eval-frame-reducer";

import messagePasserEditor from "../../shared/utils/redux-to-port-message-passer";

import evalFrameStateSelector from "../state-schemas/eval-frame-state-selector";
import fileSourceReducer from "./file-source-reducer";
import consoleHistory from "../console/history/reducer";
import consoleInput from "../console/input/reducer";
/*
It is suggested that using combineReducers, and following the standard
of having each reducer only function on a section of the state container,
might be a better approach. Redux makes it easy to refactor,
but we're not there quite yet. I'd rather simply decompose our reducers
so we can more manageably test them.
*/

function reduceReducers(...reducers) {
  return (previous, current) =>
    reducers.reduce((p, r) => r(p, current), previous);
}

function sendStateToEvalFrame(state) {
  messagePasserEditor.postMessage(
    "STATE_UPDATE_FROM_EDITOR",
    evalFrameStateSelector(state)
  );
  return state;
}

export default reduceReducers(
  notebookReducer,
  fileSourceReducer,
  evalFrameActionReducer,
  consoleHistory,
  consoleInput,
  sendStateToEvalFrame
);
