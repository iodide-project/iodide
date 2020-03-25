import {
  addConsoleEntryInEditor,
  sendStatusResponseToEditor
} from "./editor-message-senders";

import { IODIDE_EVALUATION_RESULTS } from "../iodide-evaluation-results";
// import generateRandomId from "../../shared/utils/generate-random-id";
// import { getErrorStackFrame } from "./eval-by-script-tag-stack-summary";
import jsKernel from "./javascript-kernel";

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

window.evalJavaScript = jsKernel.evalJavaScript;

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
          `Error evaluating ${language.displayName}; evaluation module "${module}" not not defined`
        );
      }
      throw e;
    }
  }

  return window[module][evaluator](code);
}

export async function evaluateCodeV2Plugins(code, language, chunkId, evalId) {
  MOST_RECENT_CHUNK_ID.set(chunkId);
  const { module, evaluator } = language;
  const { value, jsScriptTagBlobId, errorStack } = await window[module][
    evaluator
  ](code, { evalId });

  const status = errorStack === undefined ? "SUCCESS" : "ERROR";

  IODIDE_EVALUATION_RESULTS[evalId] = value;

  sendStatusResponseToEditor(status, evalId, {
    jsScriptTagBlobId,
    historyId: evalId,
    errorStack
  });
}

export async function evaluateCode(code, language, chunkId, evalId) {
  if (language.pluginVersion === 2) {
    evaluateCodeV2Plugins(code, language, chunkId, evalId);
    return;
  }
  try {
    MOST_RECENT_CHUNK_ID.set(chunkId);
    const value = await runCodeWithLanguage(language, code);

    IODIDE_EVALUATION_RESULTS[evalId] = value;
    sendStatusResponseToEditor("SUCCESS", evalId, { historyId: evalId });
  } catch (error) {
    IODIDE_EVALUATION_RESULTS[evalId] = error;
    sendStatusResponseToEditor("ERROR", evalId, { historyId: evalId });
  }
}
