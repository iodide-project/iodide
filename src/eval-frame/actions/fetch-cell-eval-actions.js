import parseFetchCell from "./fetch-cell-parser";
import {
  historyIdGen,
  updateUserVariables,
  addToConsole,
  updateConsoleEntry,
  sendStatusResponseToEditor
} from "./actions";

import {
  genericFetch as fetchLocally,
  syntaxErrorToString,
  successMessage,
  errorMessage
} from "../../tools/fetch-tools";

import fetchFileFromParentContext from "../tools/fetch-file-from-parent-context";

export function fetchProgressInitialStrings(fetchInfo) {
  let text;
  if (fetchInfo.parsed.error) text = `${syntaxErrorToString(fetchInfo)}\n`;
  else
    text = `fetching ${fetchInfo.parsed.fetchType} from ${
      fetchInfo.parsed.filePath
    }\n`;
  return {
    text,
    id: fetchInfo.id
  };
}

function setVariableInWindow(variableName, variableValue) {
  window[variableName] = variableValue;
}

function loadScriptFromBlob(blob) {
  // for async script loading from blobs, see:
  // https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const url = URL.createObjectURL(blob);
    script.onload = () => resolve(`scripted loaded from ${blob}`);
    script.onerror = err => reject(new Error(err));
    script.src = url;
    document.head.appendChild(script);
  });
}

async function addCSS(stylesheet, fetchSpec) {
  document
    .querySelectorAll(`style[data-href='${fetchSpec.parsed.filePath}']`)
    .forEach(linkNode => {
      linkNode.parentNode.removeChild(linkNode);
    });

  const style = document.createElement("style");
  style.innerHTML = stylesheet;
  style.setAttribute("data-href", fetchSpec.parsed.filePath);
  document.head.appendChild(style);
  return stylesheet;
}

export async function handleFetch(fetchInfo) {
  if (fetchInfo.parsed.error !== undefined) {
    return Promise.resolve(
      errorMessage(fetchInfo, syntaxErrorToString(fetchInfo))
    );
  }

  const { filePath, fetchType, isRelPath } = fetchInfo.parsed;
  // the following for text, json, blob, css
  let fetchedFile;
  const fileFetcher = isRelPath ? fetchFileFromParentContext : fetchLocally;
  try {
    fetchedFile = await fileFetcher(filePath, fetchType);
  } catch (err) {
    return Promise.resolve(errorMessage(fetchInfo, err.message));
  }

  const assignVariable = (params, file) =>
    setVariableInWindow(params.parsed.varName, file);

  if (["text", "json", "blob"].includes(fetchType)) {
    assignVariable(fetchInfo, fetchedFile);
  } else if (fetchType === "js") {
    let scriptLoaded;
    try {
      scriptLoaded = await loadScriptFromBlob(fetchedFile);
    } catch (err) {
      return Promise.resolve(errorMessage(fetchInfo, err.message));
    }
    return Promise.resolve(successMessage(fetchInfo, scriptLoaded));
  } else if (fetchType === "css") {
    addCSS(fetchedFile, fetchInfo);
  } else {
    return Promise.resolve(errorMessage(fetchInfo, "unknown fetch type"));
  }
  return Promise.resolve(successMessage(fetchInfo));
}

export function evaluateFetchText(fetchText, evalId) {
  return dispatch => {
    const inputHistoryId = historyIdGen.nextId();
    dispatch(
      addToConsole({
        historyType: "CONSOLE_INPUT",
        historyId: inputHistoryId,
        content: fetchText,
        additionalArguments: {
          language: "fetch"
        }
      })
    );
    const outputHistoryId = historyIdGen.nextId();
    const fetches = parseFetchCell(fetchText);
    const syntaxErrors = fetches.filter(fetchInfo => fetchInfo.parsed.error);
    if (syntaxErrors.length) {
      dispatch(
        addToConsole({
          historyType: "FETCH_CELL_INFO",
          historyId: outputHistoryId,
          content: syntaxErrors.map(fetchProgressInitialStrings)
        })
      );
      sendStatusResponseToEditor("ERROR", evalId);
      return Promise.resolve();
    }

    let progressStrings = fetches.map(fetchProgressInitialStrings);

    dispatch(
      addToConsole({
        historyType: "FETCH_CELL_INFO",
        historyId: outputHistoryId,
        content: progressStrings
      })
    );

    const fetchCalls = fetches.map((f, i) =>
      handleFetch(f).then(outcome => {
        progressStrings = progressStrings.map(entry =>
          Object.assign({}, entry)
        );
        progressStrings[i] = outcome;
        // dispatch(updateValueInHistory(historyId, progressStrings));
        dispatch(
          updateConsoleEntry({
            historyId: outputHistoryId,
            content: progressStrings
          })
        );
        console.log(">>>", progressStrings);
        return outcome;
      })
    );

    return Promise.all(fetchCalls)
      .finally(() => {
        dispatch(updateUserVariables());
      })
      .then(() => {
        sendStatusResponseToEditor("SUCCESS", evalId);
      });
  };
}
