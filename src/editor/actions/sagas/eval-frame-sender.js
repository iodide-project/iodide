import { take, call } from "redux-saga/effects";
import messagePasserEditor from "../../../shared/utils/redux-to-port-message-passer";
import generateRandomId from "../../../shared/utils/generate-random-id";

// sender
export function sendTaskToEvalFrame(taskType, payload, taskId) {
  messagePasserEditor.postMessage(taskType, { ...payload, taskId });
}

// sagas
export function* triggerEvalFrameTask(
  taskType,
  payload,
  throwOnError = true,
  taskId = generateRandomId()
) {
  yield call(sendTaskToEvalFrame, taskType, payload, taskId);

  const response = yield take(`EVAL_FRAME_TASK_RESPONSE-${taskId}`);

  if (throwOnError) {
    if (response.status === "ERROR") {
      throw new Error(`EVAL_FRAME_TASK_RESPONSE-${taskId}-FAILED`);
    }
    return response.payload;
  }
  return response;
}
