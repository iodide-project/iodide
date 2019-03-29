import messagePasserEval from "../../shared/utils/redux-to-port-message-passer";
import {
  addToConsoleHistory,
  updateConsoleEntry
} from "./console-history-actions";

export function sendStatusResponseToEditor(status, evalId, payload) {
  messagePasserEval.postMessage("EVAL_FRAME_TASK_RESPONSE", {
    status,
    evalId,
    payload
  });
}

export function sendActionToEditor(action) {
  messagePasserEval.postMessage("REDUX_ACTION", action);
}

export function addConsoleEntryInEditor(action) {
  messagePasserEval.postMessage("REDUX_ACTION", addToConsoleHistory(action));
}

export function updateConsoleEntryInEditor(action) {
  messagePasserEval.postMessage("REDUX_ACTION", updateConsoleEntry(action));
}
