import { take, call } from "redux-saga/effects";
import messagePasserEditor from "../../../shared/utils/redux-to-port-message-passer";
import generateRandomId from "../../../shared/utils/generate-random-id";

// sender
export function sendTaskToEvalFrame(taskType, payload) {
  const taskId = generateRandomId();
  messagePasserEditor.postMessage(
    taskType,
    Object.assign({}, payload, { taskId })
  );
  return taskId;
}

// sagas
export function* triggerEvalFrameTask(taskType, payload) {
  const taskId = yield call(sendTaskToEvalFrame, taskType, payload);
  const response = yield take(`EVAL_FRAME_TASK_RESPONSE-${taskId}`);
  if (response.status === "ERROR") {
    throw new Error(`EVAL_FRAME_TASK_RESPONSE-${taskId}-FAILED`);
  }
  return response.payload;
}
