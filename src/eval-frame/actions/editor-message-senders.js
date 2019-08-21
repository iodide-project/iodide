import messagePasserEval from "../../shared/utils/redux-to-port-message-passer";
import generateRandomId from "../../shared/utils/generate-random-id";

export function sendStatusResponseToEditor(status, evalId, payload) {
  messagePasserEval.postMessage("EVAL_FRAME_TASK_RESPONSE", {
    status,
    evalId,
    payload
  });
}

export function sendResponseMessageToEditor(status, responseId, payload) {
  if (typeof responseId !== "string") {
    throw new TypeError("response messages must include a valid responseId");
  }
  messagePasserEval.postMessage("RESPONSE_MESSAGE", {
    status,
    responseId,
    payload
  });
}

export function sendActionToEditor(action) {
  messagePasserEval.postMessage("REDUX_ACTION", action);
}

export function addConsoleEntryInEditor(historyItemAction) {
  const historyId = generateRandomId();
  messagePasserEval.postMessage("REDUX_ACTION", {
    historyId,
    type: "console/history/ADD",
    ...historyItemAction
  });
  return historyId;
}

export function updateConsoleEntryInEditor(historyItem) {
  messagePasserEval.postMessage("REDUX_ACTION", {
    type: "console/history/UPDATE",
    historyItem
  });
}
