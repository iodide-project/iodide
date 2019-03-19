import { take, takeEvery, put, call, select } from "redux-saga";

import { languageReady, languageKnown } from "./eval-actions";
import createHistoryItem from "../tools/create-history-item";

const languageNeedsLoading = (state, lang) =>
  languageKnown(state, lang) && !languageReady(state, lang);

function sendTaskToEvalFrame() {
  return Math.random();
}

export function* triggerEvalFrameTask(type, payload) {
  const taskId = yield call(sendTaskToEvalFrame, type, payload);
  const response = yield take("EVAL_FRAME_TASK_RESPONSE");
  if (response.taskId === taskId) {
    return response.status;
  }
  return 1;
}

export function* loadKnownLanguage(langDef) {
  yield put({
    type: "ADD_TO_CONSOLE_HISTORY",
    ...createHistoryItem({
      historyType: "CONSOLE_MESSAGE",
      content: `Loading ${langDef.displayName} language plugin`,
      level: "LOG"
    })
  });
  yield call(triggerEvalFrameTask, "LOAD_KNOWN_LANGUAGE", langDef.languageId);
}

export function* evaluateChunk(chunk) {
  yield put({ type: "ADD_INPUT_TO_CONSOLE" });
  if (chunk.chunkType === "plugin") {
    yield call(triggerEvalFrameTask, "EVAL_LANGUAGE_PLUGIN", chunk.evalText);
  } else if (chunk.chunkType === "fetch") {
    yield call(triggerEvalFrameTask, "EVAL_FETCH", chunk.evalText);
  } else {
    yield call(triggerEvalFrameTask, "EVAL_CODE", chunk.evalText);
  }
}

export function* evaluateNextInQueue() {
  const state = yield select();
  if (state.evalQueue.length === 0) return;
  const chunk = state.evalQueue[0];
  yield put({ type: "PULL_FROM_EVAL_QUEUE" });
  try {
    if (languageNeedsLoading(state, chunk.chunkType)) {
      yield loadKnownLanguage(state.languageDefinitions[chunk.chunkType]);
    }
    yield evaluateChunk(chunk);
  } catch (error) {
    yield put({ type: "CLEAR_EVAL_QUEUE" });
  }
}

export function* evaluateCurrentQueue() {
  yield takeLeading("ADD_TO_EVAL_QUEUE", evaluateNextInQueue);
}
