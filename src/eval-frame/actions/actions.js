import MarkdownIt from "markdown-it";
import MarkdownItKatex from "markdown-it-katex";
import MarkdownItAnchor from "markdown-it-anchor";

import { NONCODE_EVAL_TYPES } from "../../state-schemas/state-schema";

import {
  // evaluateLanguagePluginCell,
  evaluateLanguagePlugin,
  ensureLanguageAvailable,
  runCodeWithLanguage
} from "./language-actions";

import { evaluateFetchText } from "./fetch-cell-eval-actions";
import { postMessageToEditor } from "../port-to-editor";

const MD = MarkdownIt({ html: true });
MD.use(MarkdownItKatex).use(MarkdownItAnchor);

// NB: this is a POC, and should be made better than this.
// takeOverConsole needs a dispatch. This can be done outside of actions,
// but I guess I'll leave it here for now. Make sure to delete this note
// if this PR goes somewhere.
let takeOver = false;
/* eslint-disable */
function takeOverConsole(dispatch) {
  if (takeOver) return
  if (!takeOver) takeOver = true
  const console = window.console;
  if (!console) return;
  function intercept(method) {
    const original = console[method];
    console[method] = function() {
      dispatch(appendToEvalHistory(
        null,
        method,
        arguments,
        {
          historyType: "CONSOLE_MESSAGE"
        }
      ))
      if (original.apply) {
        // Do this for normal browsers
        original.apply(console, arguments);
      } else {
        // Do this for IE
        const message = Array.prototype.slice.apply(arguments).join(" ");
        original(message);
      }
    };
  }
  const methods = ["log", "warn", "error"];
  for (let i = 0; i < methods.length; i++) intercept(methods[i]);
}
/* eslint-enable */

const CodeMirror = require('codemirror') // eslint-disable-line

const initialVariables = new Set(Object.keys(window)); // gives all global variables
initialVariables.add("__core-js_shared__");
initialVariables.add("Mousetrap");
initialVariables.add("CodeMirror");
initialVariables.add("FETCH_RESOLVERS");

export function sendStatusResponseToEditor(status, evalId) {
  postMessageToEditor("EVALUATION_RESPONSE", { status, evalId });
}

export function addToEvaluationQueue(chunk) {
  postMessageToEditor("ADD_TO_EVALUATION_QUEUE", chunk);
}

function getUserDefinedVariablesFromWindow() {
  return Object.keys(window).filter(g => !initialVariables.has(g));
}

function IdFactory() {
  this.state = 0;
  this.nextId = () => {
    this.state += 1;
    return this.state;
  };
}

export const historyIdGen = new IdFactory();

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
  const historyId =
    historyOptions.historyId === undefined
      ? historyIdGen.nextId()
      : historyOptions.historyId;
  const historyType =
    historyOptions.historyType === undefined
      ? "CELL_EVAL_VALUE"
      : historyOptions.historyType;

  EVALUATION_RESULTS[historyId] = value;

  // returned obj must match history schema
  return {
    type: "APPEND_TO_EVAL_HISTORY",
    cellId,
    content,
    historyId,
    historyType,
    lastRan: Date.now()
  };
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
    takeOverConsole(dispatch);
    const updateCellAfterEvaluation = (output, evalStatus) => {
      const cellProperties = { rendered: true };
      if (evalStatus === "ERROR") {
        cellProperties.evalStatus = evalStatus;
        sendStatusResponseToEditor("ERROR", evalId);
      } else {
        sendStatusResponseToEditor("SUCCESS", evalId);
      }
      dispatch(appendToEvalHistory(null, code, output));
      dispatch(updateUserVariables());
    };

    const messageCallback = msg => {
      dispatch(
        appendToEvalHistory(null, msg, undefined, {
          historyType: "CELL_EVAL_INFO"
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
            historyType: "CONSOLE_EVAL"
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
