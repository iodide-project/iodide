import {
  addConsoleEntryInEditor,
  updateConsoleEntryInEditor
} from "./editor-message-senders";
import { IODIDE_EVALUATION_RESULTS } from "../iodide-evaluation-results";

export function loadLanguagePlugin(pluginData, historyId) {
  let value;
  let languagePluginPromise;

  addConsoleEntryInEditor({
    historyType: "CONSOLE_MESSAGE",
    content: "fetching plugin",
    historyId,
    level: "LOG"
  });
  if (pluginData.url === undefined) {
    value = 'plugin definition missing "url"';
    updateConsoleEntryInEditor({ historyId, content: value, level: "ERROR" });
  } else {
    const { url, displayName } = pluginData;

    languagePluginPromise = new Promise((resolve, reject) => {
      const xhrObj = new XMLHttpRequest();

      xhrObj.addEventListener("progress", evt => {
        value = `downloading plugin: ${evt.loaded} bytes loaded`;
        if (evt.total > 0) {
          value += `out of ${evt.total} (${evt.loaded / evt.total}%)`;
        }
        updateConsoleEntryInEditor({ historyId, content: value });
      });

      xhrObj.addEventListener("load", () => {
        value = `${displayName} plugin downloaded, initializing`;
        updateConsoleEntryInEditor({ historyId, content: value, level: "LOG" });
        // see the following for asynchronous loading of scripts from strings:
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts

        window.languagePluginUrl = url;

        if (xhrObj.status > 400 && xhrObj.status < 600) {
          value = `${displayName} failed to load: ${xhrObj.status} ${xhrObj.statusText}`;
          updateConsoleEntryInEditor({
            historyId,
            content: value,
            level: "ERROR"
          });
          resolve();
        }

        // Here, we wrap whatever the return value of the eval into a promise.
        // If it is simply evaling a code block, then it returns undefined.
        // But if it returns a Promise, then we can wait for that promise to resolve
        // before we continue execution.
        const pr = Promise.resolve(window.eval(xhrObj.responseText)); // eslint-disable-line no-eval

        pr.then(() => {
          value = `${displayName} plugin ready`;
          updateConsoleEntryInEditor({
            historyId,
            content: value,
            level: "LOG"
          });
          delete window.languagePluginUrl;
          resolve();
        }).catch(error => {
          updateConsoleEntryInEditor({
            historyId,
            content: value,
            level: "ERROR"
          });

          const historyIdForError = addConsoleEntryInEditor({
            historyType: "CONSOLE_OUTPUT",
            level: "ERROR"
          });
          IODIDE_EVALUATION_RESULTS[historyIdForError] = error;

          // sendStatusResponseToEditor("ERROR", evalId);
          reject(error);
        });
      });

      xhrObj.addEventListener("error", () => {
        value = `${displayName} plugin failed to load: ${url} not found
        `;
        updateConsoleEntryInEditor({
          historyId,
          content: value,
          level: "ERROR"
        });
        reject();
      });

      xhrObj.open("GET", url, true);
      xhrObj.send();
    });
  }
  return languagePluginPromise;
}
