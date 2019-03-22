/* global IODIDE_BUILD_MODE */

import notebookReducer from "./notebook-reducer";

import evalFrameActionReducer from "./eval-frame-reducer";

import { postMessageToEvalFrame } from "../port-to-eval-frame";
import evalFrameStateSelector from "../state-schemas/eval-frame-state-selector";
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
  // FIXME: this is a terrible hack to make the tests work.
  // it must be stamped out.
  if (IODIDE_BUILD_MODE !== "test") {
    try {
      postMessageToEvalFrame(
        "STATE_UPDATE_FROM_EDITOR",
        evalFrameStateSelector(state)
      );
    } catch (e) {
      return state;
    }
  }
  return state;
}

export default reduceReducers(
  notebookReducer,
  evalFrameActionReducer,
  sendStateToEvalFrame
);
