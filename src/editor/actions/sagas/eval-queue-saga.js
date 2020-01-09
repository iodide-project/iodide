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
  addInputToConsole,
  addOutputToConsole,
  addErrorStackToConsole,
  addEvalTypeConsoleErrorToHistory
} from "../../console/history/actions";

import {
  recordTracebackInfo,
  recordErrorStack
} from "../../tracebacks/actions";

import { evaluateFetch } from "./fetch-cell-saga";
import { triggerEvalFrameTask } from "./eval-frame-sender";
import {
  languageReady,
  languageNeedsLoading,
  languageKnown,
  loadKnownLanguage,
  evaluateLanguagePlugin
} from "./language-plugin-saga";

import { historyIdGen } from "../../tools/id-generators";

// helpers

const evalTypeIsDefined = (state, lang) =>
  languageReady(state, lang) ||
  languageKnown(state, lang) ||
  RUNNABLE_CHUNK_TYPES.includes(lang) ||
  NONCODE_EVAL_TYPES.includes(lang);

// sagas
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

export function* evaluateByType(chunk) {
  const {
    chunkType: evalType,
    chunkContent: evalText,
    chunkId,
    startLine,
    endLine
  } = chunk;
  const state = yield select();
  const evalId = `input-${historyIdGen.nextId()}-${evalType}`;

  if (!evalTypeIsDefined(state, evalType)) {
    yield put(addEvalTypeConsoleErrorToHistory(evalType));
    throw new Error("unknown evalType");
  }

  if (languageNeedsLoading(state, evalType)) {
    yield call(loadKnownLanguage, state.languageDefinitions[evalType]);
  }

  yield put(
    addInputToConsole(evalText, evalType, evalId, startLine, endLine, chunkId)
  );

  if (evalType === "plugin") {
    yield call(evaluateLanguagePlugin, evalText);
  } else if (evalType === "fetch") {
    yield call(evaluateFetch, evalText);
  } else {
    const language = state.languageDefinitions[evalType];
    const { status, payload } = yield call(
      triggerEvalFrameTask,
      "EVAL_CODE",
      {
        code: evalText,
        language,
        chunkId
      },
      false,
      evalId
    );

    const level = status === "ERROR" ? "ERROR" : undefined;
    const { tracebackId, errorStack } = payload;

    if (tracebackId !== undefined) {
      yield put(recordTracebackInfo(evalId, tracebackId, evalType));
    }

    if (errorStack !== undefined) {
      yield put(recordErrorStack(evalId, errorStack));
      yield put(addErrorStackToConsole(evalId));
    } else {
      yield put(addOutputToConsole(level, evalId));
    }

    if (status === "ERROR") {
      // need to throw here to halt evals and clear queue
      throw new Error(`CODE EVAL FAILED: ${evalId}`);
    }
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
      yield put(setKernelState("KERNEL_BUSY"));
      yield call(evaluateByType, chunk);
      yield put(setKernelState("KERNEL_IDLE"));
    } catch (error) {
      if (process.env.NODE_ENV === "dev") {
        console.error("------ Caught error at eval queue top level ------");
        console.error(error);
      }
      yield flush(evalQueue);
      yield put(setKernelState("KERNEL_IDLE"));
    }
  }
}
