import CodeMirror from "codemirror";
import {
  take,
  actionChannel,
  put,
  call,
  select,
  flush
} from "redux-saga/effects";

import {
  NONCODE_EVAL_TYPES,
  RUNNABLE_CHUNK_TYPES
} from "../../state-schemas/state-schema";

import { setKernelState } from "../eval-actions";

import {
  loadingLanguageConsoleMsg,
  addInputToConsole,
  evalTypeConsoleError,
  pluginParseError
} from "../console-message-actions";

import messagePasserEditor from "../../../shared/utils/redux-to-port-message-passer";
import generateRandomId from "../../../shared/utils/generate-random-id";

// helpers

export const languageReady = (state, lang) =>
  Object.keys(state.loadedLanguages).includes(lang);

export const languageKnown = (state, lang) =>
  Object.keys(state.languageDefinitions).includes(lang);

const evalTypeIsDefined = (state, lang) =>
  languageReady(state, lang) ||
  languageKnown(state, lang) ||
  RUNNABLE_CHUNK_TYPES.includes(lang) ||
  NONCODE_EVAL_TYPES.includes(lang);

export const languageNeedsLoading = (state, lang) =>
  languageKnown(state, lang) && !languageReady(state, lang);

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

export function* loadLanguagePlugin(pluginData) {
  yield call(triggerEvalFrameTask, "EVAL_LANGUAGE_PLUGIN", {
    pluginData
  });
  // FIXME this empty function argument seems sketchy
  yield call([CodeMirror, "requireMode"], pluginData.codeMirrorMode, () => {});
  yield put({
    type: "ADD_LANGUAGE_TO_EDITOR",
    languageDefinition: pluginData
  });
}

export function* loadKnownLanguage(pluginData) {
  yield put(loadingLanguageConsoleMsg(pluginData.displayName));
  yield call(loadLanguagePlugin, pluginData);
}

export function* updateUserVariables() {
  const { userDefinedVarNames } = yield call(
    triggerEvalFrameTask,
    "UPDATE_USER_VARIABLES"
  );
  yield put({
    type: "UPDATE_USER_VARIABLES",
    userDefinedVarNames
  });
}

export function* evaluateLanguagePlugin(pluginText) {
  try {
    const pluginData = JSON.parse(pluginText);
    yield call(loadLanguagePlugin, pluginData);
  } catch (error) {
    yield put(pluginParseError(error.message));
    throw error;
  }
}

export function* evaluateByType(evalType, evalText, chunkId) {
  const state = yield select();

  if (!evalTypeIsDefined(state, evalType)) {
    yield put(evalTypeConsoleError(evalType));
    throw new Error("unknown evalType");
  }

  if (languageNeedsLoading(state, evalType)) {
    yield call(loadKnownLanguage, state.languageDefinitions[evalType]);
  }

  yield put(addInputToConsole(evalText, evalType));
  if (evalType === "plugin") {
    yield call(evaluateLanguagePlugin, evalText);
  } else if (evalType === "fetch") {
    yield call(triggerEvalFrameTask, "EVAL_FETCH", { fetchText: evalText });
  } else {
    yield call(triggerEvalFrameTask, "EVAL_CODE", {
      code: evalText,
      language: state.languageDefinitions[evalType],
      chunkId
    });
  }
  yield call(updateUserVariables);
}

// FIXME: there does not seem to be a good way to fully test
// this particular saga, at least using redux-saga-test-plan
// https://github.com/jfairbank/redux-saga-test-plan/issues/247
export function* evaluateCurrentQueue() {
  const evalQueue = yield actionChannel("ADD_TO_EVAL_QUEUE");
  while (true) {
    try {
      const { chunk } = yield take(evalQueue);
      const { chunkType, chunkContent, chunkId } = chunk;
      yield put(setKernelState("KERNEL_BUSY"));
      yield call(evaluateByType, chunkType, chunkContent, chunkId);
      yield put(setKernelState("KERNEL_IDLE"));
    } catch (error) {
      yield flush(evalQueue);
      yield put(setKernelState("KERNEL_IDLE"));
    }
  }
}
