import { NONCODE_EVAL_TYPES } from "../../state-schemas/state-schema";
import { addToConsoleHistory } from "./console-history-actions";
import {
  evaluateLanguagePlugin,
  runCodeWithLanguage,
  loadLanguagePlugin
} from "./language-actions";

import { evaluateFetchText } from "./fetch-cell-eval-actions";
import messagePasserEval from "../../redux-to-port-message-passer";
import { sendStatusResponseToEditor } from "./editor-message-senders";

const CodeMirror = require("codemirror"); // eslint-disable-line

const initialVariables = new Set(Object.keys(window)); // gives all global variables
initialVariables.add("__core-js_shared__");
initialVariables.add("Mousetrap");
initialVariables.add("CodeMirror");
initialVariables.add("FETCH_RESOLVERS");
initialVariables.add("__SECRET_EMOTION__");

export function addToEvaluationQueue(chunk) {
  messagePasserEval.postMessage("ADD_TO_EVALUATION_QUEUE", chunk);
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

export function setConsoleLanguage(language) {
  return {
    type: "SET_CONSOLE_LANGUAGE",
    language
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

function evaluateCode(code, language, state, evalId, langDef = null) {
  // NB: using langDef here lets us immediately pass a reference to
  // a language definition that has bee loaded in the evalframe,
  // but for which the messages have not gone to the editor and back
  // to ensure that the language def is in state.loadedLanguages
  // in the eval frame.
  // This is only needed in the case of languages like pyodide that are known
  // but not loaded at init.

  return async dispatch => {
    const messageCallback = msg => {
      dispatch(
        addToConsoleHistory({
          content: msg,
          historyType: "CONSOLE_MESSAGE",
          level: "LOG"
        })
      );
    };

    try {
      const output = await runCodeWithLanguage(
        langDef || state.loadedLanguages[language],
        code,
        messageCallback
      );

      sendStatusResponseToEditor("SUCCESS", evalId);
      dispatch(
        addToConsoleHistory({
          historyType: "CONSOLE_OUTPUT",
          value: output
        })
      );
    } catch (error) {
      sendStatusResponseToEditor("ERROR", evalId);
      dispatch(
        addToConsoleHistory({
          historyType: "CONSOLE_OUTPUT",
          value: error,
          level: "ERROR"
        })
      );
    }
    dispatch(updateUserVariables());
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
  return async (dispatch, getState) => {
    // FIXME: pretty much all of this logic should live on the editor side.
    // The editor should send down messages for distinct eval types,
    // and in particular, the editor should know if a language (like pyodide)
    // is known but not yet loaded, and should kick off and await completion
    // of the language loading process before attemping to eval code.
    // Eval operations should also not use dispatch at all, they should just
    // send back updates as they go.

    if (
      NONCODE_EVAL_TYPES.includes(evalType) ||
      evalType === "" ||
      evalText === ""
    ) {
      // if this chunk is a no-op, bail out right away
      sendStatusResponseToEditor("SUCCESS", evalId);
      return Promise.resolve();
    }

    MOST_RECENT_CHUNK_ID.set(chunkId);
    const sideEffect = document.getElementById(
      `side-effect-target-${MOST_RECENT_CHUNK_ID.get()}`
    );
    if (sideEffect) {
      sideEffect.innerText = null;
    }
    const state = getState();
    const languageReady = Object.keys(state.loadedLanguages).includes(evalType);
    const languageKnown = Object.keys(state.languageDefinitions).includes(
      evalType
    );

    dispatch(
      addToConsoleHistory({
        historyType: "CONSOLE_INPUT",
        content: evalText,
        language: evalType
      })
    );

    if (evalType === "fetch") {
      return dispatch(evaluateFetchText(evalText, evalId));
    } else if (evalType === "plugin") {
      return dispatch(evaluateLanguagePlugin(evalText, evalId));
    } else if (languageReady) {
      return dispatch(evaluateCode(evalText, evalType, state, evalId));
    } else if (languageKnown) {
      try {
        const langDef = state.languageDefinitions[evalType];
        dispatch(
          addToConsoleHistory({
            historyType: "CONSOLE_MESSAGE",
            content: `Loading ${langDef.displayName} language plugin`,
            level: "LOG"
          })
        );
        await loadLanguagePlugin(langDef, dispatch);
        return dispatch(
          evaluateCode(evalText, evalType, state, evalId, langDef)
        );
      } catch (error) {
        return Promise.reject();
      }
    } else {
      sendStatusResponseToEditor("ERROR", evalId);
      dispatch(
        addToConsoleHistory({
          historyType: "CONSOLE_OUTPUT",
          value: new Error(`eval type ${evalType} is not defined`),
          level: "ERROR"
        })
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
