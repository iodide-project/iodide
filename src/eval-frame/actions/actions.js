import messagePasserEval from "../../shared/utils/redux-to-port-message-passer";
import {
  addConsoleEntryInEditor,
  sendStatusResponseToEditor
} from "./editor-message-senders";

const CodeMirror = require("codemirror"); // eslint-disable-line

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

export function runCodeWithLanguage(language, code) {
  const { module, evaluator, asyncEvaluator } = language;
  if (asyncEvaluator !== undefined) {
    try {
      const messageCallback = msg => {
        addConsoleEntryInEditor({
          content: msg,
          historyType: "CONSOLE_MESSAGE",
          level: "LOG"
        });
      };
      return window[module][asyncEvaluator](code, messageCallback);
    } catch (e) {
      if (e.message === "window[module] is undefined") {
        throw new Error(
          `Error evaluating ${
            language.displayName
          }; evaluation module "${module}" not not defined`
        );
      }
      throw e;
    }
  }
  // FIXME: i experimented with this, and I think
  // wrapping this in a promise doesn't do anything.
  // i think we can simplify this away. -bc
  return new Promise((resolve, reject) => {
    try {
      resolve(window[module][evaluator](code));
    } catch (e) {
      reject(e);
    }
  });
}

export async function evaluateCode(code, language, chunkId, evalId) {
  try {
    MOST_RECENT_CHUNK_ID.set(chunkId);
    const output = await runCodeWithLanguage(language, code);
    addConsoleEntryInEditor({
      historyType: "CONSOLE_OUTPUT",
      value: output
    });

    sendStatusResponseToEditor("SUCCESS", evalId);
  } catch (error) {
    addConsoleEntryInEditor({
      historyType: "CONSOLE_OUTPUT",
      value: error,
      level: "ERROR"
    });

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
