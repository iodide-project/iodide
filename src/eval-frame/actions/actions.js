import { addToConsoleHistory } from "./console-history-actions";
import { runCodeWithLanguage } from "./language-actions";

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

export async function evaluateCode(code, language, chunkId, evalId) {
  try {
    MOST_RECENT_CHUNK_ID.set(chunkId);
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

export function saveEnvironment(updateObj, update) {
  return {
    type: "SAVE_ENVIRONMENT",
    updateObj,
    update
  };
}
