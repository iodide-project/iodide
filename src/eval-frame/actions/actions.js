import { NONCODE_EVAL_TYPES } from "../../state-schemas/state-schema";

import generateRandomId from "../../tools/generate-random-id";

import {
  evaluateLanguagePlugin,
  ensureLanguageAvailable,
  runCodeWithLanguage
} from "./language-actions";

import { evaluateFetchText } from "./fetch-cell-eval-actions";
import messagePasser from "../../redux-to-port-message-passer";

import createHistoryItem from "../../tools/create-history-item";

const CodeMirror = require("codemirror"); // eslint-disable-line

const initialVariables = new Set(Object.keys(window)); // gives all global variables
initialVariables.add("__core-js_shared__");
initialVariables.add("Mousetrap");
initialVariables.add("CodeMirror");
initialVariables.add("FETCH_RESOLVERS");

export function sendStatusResponseToEditor(status, evalId) {
  messagePasser.postMessage("EVALUATION_RESPONSE", { status, evalId });
}

export function addToEvaluationQueue(chunk) {
  messagePasser.postMessage("ADD_TO_EVALUATION_QUEUE", chunk);
}

function getUserDefinedVariablesFromWindow() {
  return Object.keys(window).filter(g => !initialVariables.has(g));
}

class Singleton {
  constructor() {
    this.data = null;
  }
  set(data) {
    this.data = data;
  }
  get() {
    return this.data;
  }
}

const MOST_RECENT_CHUNK_ID = new Singleton();

export { MOST_RECENT_CHUNK_ID };

// ////////////// actual actions

export const EVALUATION_RESULTS = {};

export function appendToEvalHistory(
  cellId,
  content,
  value,
  historyOptions = {}
) {
  const historyType =
    historyOptions.historyType === undefined
      ? "CELL_EVAL_VALUE"
      : historyOptions.historyType;

  const historyAction = createHistoryItem({
    content,
    value,
    historyType,
    historyId: historyOptions.historyId,
    lastRan: historyOptions.lastRan
  });
  historyAction.type = "APPEND_TO_EVAL_HISTORY";

  EVALUATION_RESULTS[historyAction.historyId] = value;

  return historyAction;
}

export function updateValueInHistory(historyId, value) {
  EVALUATION_RESULTS[historyId] = value;
  return {
    type: "UPDATE_VALUE_IN_HISTORY",
    historyId
  };
}

export function updateUserVariables() {
  return {
    type: "UPDATE_USER_VARIABLES",
    userDefinedVarNames: getUserDefinedVariablesFromWindow()
  };
}

export function updateConsoleText(consoleText) {
  return {
    type: "UPDATE_CONSOLE_TEXT",
    consoleText
  };
}

export function consoleHistoryStepBack(consoleCursorDelta) {
  return {
    type: "CONSOLE_HISTORY_MOVE",
    consoleCursorDelta
  };
}

export function evalConsoleInput(consoleText) {
  return (dispatch, getState) => {
    const state = getState();
    // const code = state.consoleText
    // exit if there is no code in the console to  eval
    if (!consoleText) {
      return undefined;
    }
    const evalLanguageId = state.languageLastUsed;

    dispatch({ type: "CLEAR_CONSOLE_TEXT_CACHE" });
    dispatch({ type: "RESET_HISTORY_CURSOR" });
    addToEvaluationQueue({
      chunkType: evalLanguageId,
      chunkId: undefined,
      chunkContent: consoleText,
      evalFlags: ""
    });
    dispatch(updateConsoleText(""));
    return Promise.resolve();
  };
}

function evaluateCode(code, language, state, evalId) {
  return dispatch => {
    const historyId = generateRandomId();
    const updateCellAfterEvaluation = (output, evalStatus) => {
      const cellProperties = { rendered: true };
      if (evalStatus === "ERROR") {
        cellProperties.evalStatus = evalStatus;
        sendStatusResponseToEditor("ERROR", evalId);
      } else {
        sendStatusResponseToEditor("SUCCESS", evalId);
      }
      dispatch(appendToEvalHistory(null, code, output, { historyId }));
      dispatch(updateUserVariables());
    };

    const messageCallback = msg => {
      const messageHistoryId = generateRandomId();
      dispatch(
        appendToEvalHistory(null, msg, undefined, {
          historyType: "CELL_EVAL_INFO",
          historyId: messageHistoryId
        })
      );
    };

    return ensureLanguageAvailable(language, state, dispatch)
      .then(languageEvaluator =>
        runCodeWithLanguage(languageEvaluator, code, messageCallback)
      )
      .then(
        output => updateCellAfterEvaluation(output),
        output => updateCellAfterEvaluation(output, "ERROR")
      );
  };
}

// FIXME use evalFlags for something real
export function evaluateText(
  evalText,
  evalType,
  evalFlags, // eslint-disable-line
  chunkId = null,
  evalId
) {
  // allowed types:
  // md
  return (dispatch, getState) => {
    // exit if there is no code to eval or no eval type
    // if (!evalText || !evalType) { return undefined }
    // FIXME: we need to deprecate side effects ASAP. They don't serve a purpose
    // in the direct jsmd editing paradigm.
    const historyId = generateRandomId();

    MOST_RECENT_CHUNK_ID.set(chunkId);
    const sideEffect = document.getElementById(
      `side-effect-target-${MOST_RECENT_CHUNK_ID.get()}`
    );
    if (sideEffect) {
      sideEffect.innerText = null;
    }
    const state = getState();
    if (evalType === "fetch") {
      return dispatch(evaluateFetchText(evalText, evalId));
    } else if (evalType === "plugin") {
      return dispatch(evaluateLanguagePlugin(evalText, evalId));
    } else if (
      Object.keys(state.loadedLanguages).includes(evalType) ||
      Object.keys(state.languageDefinitions).includes(evalType)
    ) {
      return dispatch(evaluateCode(evalText, evalType, state, evalId));
    } else if (NONCODE_EVAL_TYPES.includes(evalType) || evalType === "") {
      sendStatusResponseToEditor("SUCCESS", evalId);
    } else {
      sendStatusResponseToEditor("ERROR", evalId);
      return dispatch(
        appendToEvalHistory(
          null,
          evalText,
          new Error(`eval type ${evalType} is not defined`),
          {
            historyType: "CONSOLE_EVAL",
            historyId
          }
        )
      );
    }
    return Promise.resolve();
  };
}

export function saveEnvironment(updateObj, update) {
  return {
    type: "SAVE_ENVIRONMENT",
    updateObj,
    update
  };
}
