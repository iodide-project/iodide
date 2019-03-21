import { NONCODE_EVAL_TYPES } from "../../state-schemas/state-schema";
import { addToConsoleHistory } from "./console-history-actions";
import {
  evaluateLanguagePlugin,
  runCodeWithLanguage,
  loadLanguagePlugin
} from "./language-actions";

import { evaluateFetchText } from "./fetch-cell-eval-actions";
import messagePasserEval from "../../redux-to-port-message-passer";
import {
  sendActionToEditor,
  sendStatusResponseToEditor
} from "./editor-message-senders";

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

export async function evaluateCode(code, language, evalId) {
  try {
    const output = await runCodeWithLanguage(language, code);
    sendActionToEditor(
      addToConsoleHistory({
        historyType: "CONSOLE_OUTPUT",
        value: output
      })
    );
    sendStatusResponseToEditor("SUCCESS", evalId);
  } catch (error) {
    sendActionToEditor(
      addToConsoleHistory({
        historyType: "CONSOLE_OUTPUT",
        value: error,
        level: "ERROR"
      })
    );
    sendStatusResponseToEditor("ERROR", evalId);
  }
}

// FIXME use evalFlags for something real
export function evaluateText(
  evalText,
  evalType,
  evalFlags, // eslint-disable-line
  chunkId = null,
  evalId
) {
  return async (_, getState) => {
    // FIXME: pretty much all of this logic should live on the editor side.
    // The editor should send down messages for distinct eval types,
    // and in particular, the editor should know if a language (like pyodide)
    // is known but not yet loaded, and should kick off and await completion
    // of the language loading process before attemping to eval code.

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

    sendActionToEditor(
      addToConsoleHistory({
        historyType: "CONSOLE_INPUT",
        content: evalText,
        language: evalType
      })
    );

    let result;
    if (evalType === "fetch") {
      result = await evaluateFetchText(evalText, evalId);
    } else if (evalType === "plugin") {
      result = await evaluateLanguagePlugin(evalText, evalId);
    } else if (languageReady) {
      const language = state.loadedLanguages[evalType];
      result = await evaluateCode(evalText, language, evalId);
    } else if (languageKnown) {
      try {
        const language = state.languageDefinitions[evalType];
        sendActionToEditor(
          addToConsoleHistory({
            historyType: "CONSOLE_MESSAGE",
            content: `Loading ${language.displayName} language plugin`,
            level: "LOG"
          })
        );
        await loadLanguagePlugin(language);
        result = await evaluateCode(evalText, language, evalId);
      } catch (error) {
        result = Promise.reject();
      }
    } else {
      sendStatusResponseToEditor("ERROR", evalId);
      sendActionToEditor(
        addToConsoleHistory({
          historyType: "CONSOLE_OUTPUT",
          value: new Error(`eval type ${evalType} is not defined`),
          level: "ERROR"
        })
      );
      result = Promise.reject();
    }
    sendActionToEditor(updateUserVariables());
    return result;
  };
}

export function saveEnvironment(updateObj, update) {
  return {
    type: "SAVE_ENVIRONMENT",
    updateObj,
    update
  };
}
