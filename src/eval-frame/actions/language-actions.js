import { postMessageToEditor } from "../port-to-editor";
import {
  addToConsole,
  updateConsoleEntry,
  sendStatusResponseToEditor
} from "./actions";
import generateRandomId from "../../tools/generate-random-id";

export function addLanguage(languageDefinition) {
  return {
    type: "ADD_LANGUAGE_TO_EVAL_FRAME",
    languageDefinition
  };
}

function loadLanguagePlugin(pluginData, dispatch) {
  let value;
  let languagePluginPromise;

  const historyId = generateRandomId();
  dispatch(
    addToConsole({
      historyType: "CONSOLE_MESSAGE",
      content: "fetching plugin",
      historyId,
      level: "log"
    })
  );
  if (pluginData.url === undefined) {
    value = 'plugin definition missing "url"';
    dispatch(updateConsoleEntry({ historyId, content: value, level: "error" }));
  } else {
    const { url, displayName } = pluginData;

    languagePluginPromise = new Promise((resolve, reject) => {
      const xhrObj = new XMLHttpRequest();

      xhrObj.addEventListener("progress", evt => {
        value = `downloading plugin: ${evt.loaded} bytes loaded`;
        if (evt.total > 0) {
          value += `out of ${evt.total} (${evt.loaded / evt.total}%)`;
        }
        dispatch(updateConsoleEntry({ historyId, content: value }));
      });

      xhrObj.addEventListener("load", () => {
        value = `${displayName} plugin downloaded, initializing`;
        dispatch(
          updateConsoleEntry({ historyId, content: value, level: "log" })
        );
        // see the following for asynchronous loading of scripts from strings:
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts

        window.languagePluginUrl = url;

        if (xhrObj.status > 400 && xhrObj.status < 600) {
          value = `${displayName} failed to load: ${xhrObj.status} ${
            xhrObj.statusText
          }`;
          dispatch(
            updateConsoleEntry({ historyId, content: value, level: "error" })
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
          dispatch(addLanguage(pluginData));
          postMessageToEditor("POST_LANGUAGE_DEF_TO_EDITOR", pluginData);
          dispatch(
            updateConsoleEntry({ historyId, content: value, level: "log" })
          );
          delete window.languagePluginUrl;
          resolve();
        }).catch(err => {
          dispatch(
            updateConsoleEntry({ historyId, content: value, level: "error" })
          );
          reject(err);
        });
      });

      xhrObj.addEventListener("error", () => {
        value = `${displayName} plugin failed to load: ${url} not found
        `;
        dispatch(
          updateConsoleEntry({ historyId, content: value, level: "error" })
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
  return dispatch => {
    dispatch(
      addToConsole({
        historyType: "CONSOLE_INPUT",
        content: pluginText,
        language: "plugin"
      })
    );
    let pluginData;
    try {
      pluginData = JSON.parse(pluginText);
    } catch (err) {
      dispatch(
        addToConsole({
          historyType: "CONSOLE_OUTPUT",
          content: `plugin definition failed to parse:\n${err.message}`,
          level: "error"
        })
      );
      sendStatusResponseToEditor("ERROR", evalId);
      return Promise.reject();
    }
    return loadLanguagePlugin(pluginData, dispatch)
      .then(() => {
        sendStatusResponseToEditor("SUCCESS", evalId);
      })
      .catch(err => {
        sendStatusResponseToEditor("ERROR", evalId);
        return err;
      });
  };
}

export function ensureLanguageAvailable(languageId, state, dispatch) {
  if (Object.prototype.hasOwnProperty.call(state.loadedLanguages, languageId)) {
    return new Promise(resolve => resolve(state.loadedLanguages[languageId]));
  }

  if (
    Object.prototype.hasOwnProperty.call(state.languageDefinitions, languageId)
  ) {
    dispatch(
      addToConsole({
        historyType: "CONSOLE_MESSAGE",
        content: `Loading ${
          state.languageDefinitions[languageId].displayName
        } language plugin`,
        level: "log"
      })
    );
    return loadLanguagePlugin(
      state.languageDefinitions[languageId],
      dispatch
    ).then(() => state.languageDefinitions[languageId]);
  }
  // There is neither a loaded language or a predefined definition that matches...
  // FIXME: It would be hard to get here in the UX, but with direct JSMD
  // editing you could...
  return new Promise((resolve, reject) => reject());
}

export function runCodeWithLanguage(
  language,
  code,
  messageCallback = () => {}
) {
  const { module, evaluator, asyncEvaluator } = language;
  if (asyncEvaluator !== undefined) {
    try {
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
