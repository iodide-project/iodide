import messagePasserEval from "../../redux-to-port-message-passer";

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
