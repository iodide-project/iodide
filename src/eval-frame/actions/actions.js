import {
  addConsoleEntryInEditor,
  sendStatusResponseToEditor
} from "./editor-message-senders";

import { IODIDE_EVALUATION_RESULTS } from "../iodide-evaluation-results";

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

function evalJavaScript(codeString) {
  // for async script loading from blobs, see:
  // https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts
  const tempId = Math.random().toString();
  const enhancedString = `try { window[${tempId}] = window.eval(\`
${codeString}\`)
    } catch (err) {
      window[${tempId}] = err
    }
  `;
  return new Promise((resolve, reject) => {
    const blob = new Blob([enhancedString]);
    const script = document.createElement("script");
    const url = URL.createObjectURL(blob);
    script.src = url;
    document.head.appendChild(script);
    script.onload = () => {
      const tracebackId = url.toString();
      URL.revokeObjectURL(url);
      const value = window[tempId];
      delete window[tempId];
      if (value instanceof Error) reject(value);
      resolve({ value, tracebackId });
    };
    script.onerror = err => {
      URL.revokeObjectURL(url);
      reject(new Error(err));
    };
  });
}
window.evalJavaScript = evalJavaScript;

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

export async function evaluateCode(code, language, chunkId, evalId) {
  try {
    let value;
    let tracebackId;
    MOST_RECENT_CHUNK_ID.set(chunkId);
    if (language.evalReturnsId) {
      ({ value, tracebackId } = await runCodeWithLanguage(language, code));
    } else {
      value = await runCodeWithLanguage(language, code);
    }
    const historyId = addConsoleEntryInEditor({
      historyType: "CONSOLE_OUTPUT"
    });
    IODIDE_EVALUATION_RESULTS[historyId] = value;
    sendStatusResponseToEditor("SUCCESS", evalId, { tracebackId, historyId });
  } catch (error) {
    const historyId = addConsoleEntryInEditor({
      historyType: "CONSOLE_OUTPUT",
      level: "ERROR"
    });
    IODIDE_EVALUATION_RESULTS[historyId] = error;

    sendStatusResponseToEditor("ERROR", evalId);
  }
}
