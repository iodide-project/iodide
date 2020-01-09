import {
  addConsoleEntryInEditor,
  sendStatusResponseToEditor
} from "./editor-message-senders";

import { IODIDE_EVALUATION_RESULTS } from "../iodide-evaluation-results";
import generateRandomId from "../../shared/utils/generate-random-id";

import { getErrorStackFrame } from "./eval-by-script-tag-stack-summary";

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

window.evalJavaScript = codeString => {
  // for async script loading from blobs, see:
  // https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts
  const tempId = generateRandomId();
  // temporarily saving the raw string object on `window` removes the
  // need for complicated string escaping in the eval in the script
  window[`code-${tempId}`] = codeString;

  const enhancedString = `try {
  window["${tempId}"] = window.eval(window["code-${tempId}"])
} catch (err) {
  window["${tempId}"] = err
}`;
  return new Promise(resolve => {
    const blob = new Blob([enhancedString]);
    const script = document.createElement("script");
    const url = URL.createObjectURL(blob);
    script.src = url;
    document.head.appendChild(script);
    const tracebackId = url.toString().slice(-36);
    script.onload = () => {
      URL.revokeObjectURL(url);
      const value = window[tempId];
      delete window[tempId];
      delete window[`code-${tempId}`];
      const errorStack =
        value instanceof Error ? getErrorStackFrame(value) : undefined;
      resolve({ value, tracebackId, errorStack });
    };
  });
};

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

  const { value, tracebackId, errorStack } = await runCodeWithLanguage(
    language,
    code
  );

  const status = errorStack === undefined ? "SUCCESS" : "ERROR";

  IODIDE_EVALUATION_RESULTS[evalId] = value;

  sendStatusResponseToEditor(status, evalId, {
    tracebackId,
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
