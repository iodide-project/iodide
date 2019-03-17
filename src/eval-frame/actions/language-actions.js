import messagePasserEval from "../../redux-to-port-message-passer";
import {
  sendActionToEditor,
  sendStatusResponseToEditor
} from "./editor-message-senders";
import {
  addToConsoleHistory,
  updateConsoleEntry
} from "./console-history-actions";
import generateRandomId from "../../tools/generate-random-id";

export function loadLanguagePlugin(pluginData) {
  let value;
  let languagePluginPromise;

  const historyId = generateRandomId();
  sendActionToEditor(
    addToConsoleHistory({
      historyType: "CONSOLE_MESSAGE",
      content: "fetching plugin",
      historyId,
      level: "LOG"
    })
  );
  if (pluginData.url === undefined) {
    value = 'plugin definition missing "url"';
    sendActionToEditor(
      updateConsoleEntry({ historyId, content: value, level: "ERROR" })
    );
  } else {
    const { url, displayName } = pluginData;

    languagePluginPromise = new Promise((resolve, reject) => {
      const xhrObj = new XMLHttpRequest();

      xhrObj.addEventListener("progress", evt => {
        value = `downloading plugin: ${evt.loaded} bytes loaded`;
        if (evt.total > 0) {
          value += `out of ${evt.total} (${evt.loaded / evt.total}%)`;
        }
        sendActionToEditor(updateConsoleEntry({ historyId, content: value }));
      });

      xhrObj.addEventListener("load", () => {
        value = `${displayName} plugin downloaded, initializing`;
        sendActionToEditor(
          updateConsoleEntry({ historyId, content: value, level: "LOG" })
        );
        // see the following for asynchronous loading of scripts from strings:
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts

        window.languagePluginUrl = url;

        if (xhrObj.status > 400 && xhrObj.status < 600) {
          value = `${displayName} failed to load: ${xhrObj.status} ${
            xhrObj.statusText
          }`;
          sendActionToEditor(
            updateConsoleEntry({ historyId, content: value, level: "ERROR" })
          );
          resolve();
        }

        // Here, we wrap whatever the return value of the eval into a promise.
        // If it is simply evaling a code block, then it returns undefined.
        // But if it returns a Promise, then we can wait for that promise to resolve
        // before we continue execution.
        const pr = Promise.resolve(window.eval(xhrObj.responseText)); // eslint-disable-line no-eval

        pr.then(() => {
          value = `${displayName} plugin ready`;
          messagePasserEval.postMessage(
            "POST_LANGUAGE_DEF_TO_EDITOR",
            pluginData
          );
          sendActionToEditor(
            updateConsoleEntry({ historyId, content: value, level: "LOG" })
          );
          delete window.languagePluginUrl;
          resolve();
        }).catch(err => {
          sendActionToEditor(
            updateConsoleEntry({ historyId, content: value, level: "ERROR" })
          );
          reject(err);
        });
      });

      xhrObj.addEventListener("error", () => {
        value = `${displayName} plugin failed to load: ${url} not found
        `;
        sendActionToEditor(
          updateConsoleEntry({ historyId, content: value, level: "ERROR" })
        );
        reject();
      });

      xhrObj.open("GET", url, true);
      xhrObj.send();
    });
  }
  return languagePluginPromise;
}

export function evaluateLanguagePlugin(pluginText, evalId) {
  let pluginData;
  try {
    pluginData = JSON.parse(pluginText);
  } catch (err) {
    sendActionToEditor(
      addToConsoleHistory({
        historyType: "CONSOLE_OUTPUT",
        content: `plugin definition failed to parse:\n${err.message}`,
        level: "ERROR"
      })
    );
    sendStatusResponseToEditor("ERROR", evalId);
    return Promise.reject();
  }
  return loadLanguagePlugin(pluginData)
    .then(() => {
      sendStatusResponseToEditor("SUCCESS", evalId);
    })
    .catch(err => {
      sendStatusResponseToEditor("ERROR", evalId);
      return err;
    });
}

export function runCodeWithLanguage(language, code) {
  const { module, evaluator, asyncEvaluator } = language;
  if (asyncEvaluator !== undefined) {
    try {
      const messageCallback = msg => {
        sendActionToEditor(
          addToConsoleHistory({
            content: msg,
            historyType: "CONSOLE_MESSAGE",
            level: "LOG"
          })
        );
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
  return new Promise((resolve, reject) => {
    try {
      resolve(window[module][evaluator](code));
    } catch (e) {
      reject(e);
    }
  });
}
