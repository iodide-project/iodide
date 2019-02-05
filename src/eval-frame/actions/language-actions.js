import { postMessageToEditor } from "../port-to-editor";
import {
  historyIdGen,
  updateValueInHistory,
  sendStatusResponseToEditor,
  addToConsole,
  updateConsoleEntry
} from "./actions";

export function addLanguage(languageDefinition) {
  return {
    type: "ADD_LANGUAGE_TO_EVAL_FRAME",
    languageDefinition
  };
}

function loadLanguagePlugin(pluginData, historyId, evalId, dispatch) {
  let value;
  let languagePluginPromise;
  if (pluginData.url === undefined) {
    value = 'plugin definition missing "url"';
    sendStatusResponseToEditor("ERROR", evalId);
    // dispatch(updateValueInHistory(historyId, value));
    dispatch(
      updateConsoleEntry({
        historyId,
        content: value,
        additionalArguments: { level: "error" }
      })
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
        console.error("progress", value);

        dispatch(updateValueInHistory(historyId, value));
      });

      xhrObj.addEventListener("load", () => {
        value = `${displayName} plugin downloaded, initializing`;
        // dispatch(updateValueInHistory(historyId, value));
        // see the following for asynchronous loading of scripts from strings:
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts

        window.languagePluginUrl = url;

        // Here, we wrap whatever the return value of the eval into a promise.
        // If it is simply evaling a code block, then it returns undefined.
        // But if it returns a Promise, then we can wait for that promise to resolve
        // before we continue execution.
        if (xhrObj.status > 400 && xhrObj.status < 600) {
          value = `${displayName} failed to load: ${xhrObj.status} ${
            xhrObj.statusText
          }`;
          sendStatusResponseToEditor("ERROR", evalId);
          dispatch(updateValueInHistory(historyId, value));
          resolve(value);
        }
        const pr = Promise.resolve(window.eval(xhrObj.responseText)); // eslint-disable-line no-eval

        pr.then(() => {
          value = `${displayName} plugin ready`;
          dispatch(addLanguage(pluginData));
          postMessageToEditor("POST_LANGUAGE_DEF_TO_EDITOR", pluginData);
          dispatch(updateValueInHistory(historyId, value));
          delete window.languagePluginUrl;
          resolve(value);
        });
      });

      xhrObj.addEventListener("error", () => {
        value = `${displayName} plugin failed to load`;
        dispatch(updateValueInHistory(historyId, value));
        sendStatusResponseToEditor("ERROR", evalId);
        reject();
      });

      xhrObj.open("GET", url, true);
      xhrObj.onerror = () => {
        console.error(xhrObj.status);
      };

      xhrObj.send();
    });
  }
  return languagePluginPromise;
}

export function evaluateLanguagePlugin(pluginText, evalId) {
  return dispatch => {
    const inputHistoryId = historyIdGen.nextId();
    const outputHistoryId = historyIdGen.nextId();
    let pluginData;
    dispatch(
      addToConsole({
        historyId: inputHistoryId,
        content: pluginText,
        historyType: "CONSOLE_INPUT",
        additionalArguments: { language: "plugin" }
      })
    );
    try {
      pluginData = JSON.parse(pluginText);
    } catch (err) {
      dispatch(
        addToConsole({
          historyId: outputHistoryId,
          content: `plugin definition failed to parse:\n${err.message}`,
          historyType: "CONSOLE_MESSAGE",
          additionalArguments: { level: "error" }
        })
      );
      sendStatusResponseToEditor("ERROR", evalId);
      return Promise.reject();
    }
    dispatch(
      addToConsole({
        historyId: outputHistoryId,
        content: `loading ${pluginData.displayName}`,
        historyType: "CONSOLE_OUTPUT"
      })
    );
    return loadLanguagePlugin(
      pluginData,
      outputHistoryId,
      evalId,
      dispatch
    ).then(() => {
      sendStatusResponseToEditor("SUCCESS", evalId);
    });
  };
}

export function ensureLanguageAvailable(languageId, state, evalId, dispatch) {
  if (Object.prototype.hasOwnProperty.call(state.loadedLanguages, languageId)) {
    return new Promise(resolve => resolve(state.loadedLanguages[languageId]));
  }

  if (
    Object.prototype.hasOwnProperty.call(state.languageDefinitions, languageId)
  ) {
    const historyId = historyIdGen.nextId();
    dispatch(
      addToConsole({
        historyType: "CONSOLE_MESSAGE",
        historyId,
        content: `Loading ${
          state.languageDefinitions[languageId].displayName
        } language plugin`,
        additionalArguments: { level: "log" }
      })
    );
    return loadLanguagePlugin(
      state.languageDefinitions[languageId],
      historyId,
      evalId,
      dispatch
    )
      .then(value => {
        dispatch(
          addToConsole({
            historyType: "CONSOLE_MESSAGE",
            content: value,
            additionalArguments: { level: "log" }
          })
        );
      })
      .then(() => state.languageDefinitions[languageId]);
  }
  // There is neither a loaded language or a predefined definition that matches...
  // FIXME: It would be hard to get here in the UX, but with direct JSMD
  // editing you could...
  return new Promise((resolve, reject) => reject());
}

export function runCodeWithLanguage(language, code, messageCallback) {
  const { module, evaluator, asyncEvaluator } = language;
  if (asyncEvaluator !== undefined) {
    const messageCb =
      messageCallback === undefined ? () => {} : messageCallback;
    try {
      return window[module][asyncEvaluator](code, messageCb);
    } catch (e) {
      if (e.message === "window[module] is undefined") {
        return new Error(`eval type ${module} not not defined`);
      }
      return e;
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
