import {
  take,
  actionChannel,
  put,
  call,
  select,
  flush,
  delay
} from "redux-saga/effects";

import { languageReady, languageKnown } from "./eval-actions";

import {
  loadingLanguageConsoleMsg,
  addInputToConsole
} from "./console-message-actions";

import messagePasserEditor from "../redux-to-port-message-passer";
import generateRandomId from "../tools/generate-random-id";

export const languageNeedsLoading = (state, lang) =>
  languageKnown(state, lang) && !languageReady(state, lang);

export function sendTaskToEvalFrame(taskType, payload) {
  const taskId = generateRandomId();
  messagePasserEditor.postMessage(
    taskType,
    Object.assign({}, payload, { taskId })
  );
  return taskId;
}

export function* triggerEvalFrameTask(taskType, payload) {
  const taskId = yield call(sendTaskToEvalFrame, taskType, payload);
  const response = yield take(`EVAL_FRAME_TASK_RESPONSE-${taskId}`);
  if (response.status === "ERROR") {
    throw new Error(`EVAL_FRAME_TASK_RESPONSE-${taskId}-FAILED`);
  }
  return response.status;
}

export function* loadKnownLanguage(displayName, languageId) {
  yield put(loadingLanguageConsoleMsg(displayName));
  yield call(triggerEvalFrameTask, "LOAD_KNOWN_LANGUAGE", languageId);
}

export function* evaluateByType(evalType, evalText) {
  const state = yield select();

  if (languageNeedsLoading(state, evalType)) {
    const { displayName, languageId } = state.languageDefinitions[evalType];
    yield call(loadKnownLanguage, displayName, languageId);
  }

  yield put(addInputToConsole(evalText, evalType));
  if (evalType === "plugin") {
    yield call(triggerEvalFrameTask, "EVAL_LANGUAGE_PLUGIN", evalText);
  } else if (evalType === "fetch") {
    yield call(triggerEvalFrameTask, "EVAL_FETCH", evalText);
  } else {
    yield call(triggerEvalFrameTask, "EVAL_CODE", {
      code: evalText,
      language: state.languageDefinitions[evalType]
    });
  }
}

export function* evaluateCurrentQueue() {
  const evalQueue = yield actionChannel("ADD_TO_EVAL_QUEUE");
  console.log("WITHIN evaluateCurrentQueue SAGA");

  while (true) {
    try {
      const { chunk } = yield take(evalQueue);
      const { chunkType, chunkContent } = chunk;
      yield call(evaluateByType, chunkType, chunkContent);
    } catch (error) {
      yield flush(evalQueue);
      yield delay(100);
    }
  }
}
