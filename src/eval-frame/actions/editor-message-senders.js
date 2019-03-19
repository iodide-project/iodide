import messagePasserEval from "../../redux-to-port-message-passer";

export function sendStatusResponseToEditor(status, evalId) {
  messagePasserEval.postMessage("EVALUATION_RESPONSE", { status, evalId });
}

export function sendActionToEditor(action) {
  messagePasserEval.postMessage("REDUX_ACTION", action);
}
