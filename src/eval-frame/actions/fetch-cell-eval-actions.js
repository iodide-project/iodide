import parseFetchCell from "./fetch-cell-parser";
import {
  sendActionToEditor,
  sendStatusResponseToEditor
} from "./editor-message-senders";

import {
  addToConsoleHistory,
  updateConsoleEntry
} from "./console-history-actions";

import {
  genericFetch as fetchLocally,
  syntaxErrorToString,
  successMessage,
  errorMessage
} from "../../shared/utils/fetch-tools";

import generateRandomId from "../../shared/utils/generate-random-id";
import sendFileRequestToEditor from "../tools/send-file-request-to-editor";

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
    script.onload = () => resolve(`scripted loaded`);
    script.onerror = err => reject(new Error(err));
    script.src = url;
    document.head.appendChild(script);
  });
}

async function addCSS(stylesheet, filePath) {
  document
    .querySelectorAll(`style[data-href='${filePath}']`)
    .forEach(linkNode => {
      linkNode.parentNode.removeChild(linkNode);
    });

  const style = document.createElement("style");
  style.innerHTML = stylesheet;
  style.setAttribute("data-href", filePath);
  document.head.appendChild(style);
  return stylesheet;
}

export async function handleFetch(fetchInfo) {
  const extractFileNameFromLocalFilePath = filepath => {
    return filepath
      .split("files/")
      .slice(1)
      .join("");
  };
  if (fetchInfo.parsed.error !== undefined) {
    return Promise.resolve(
      errorMessage(fetchInfo, syntaxErrorToString(fetchInfo))
    );
  }

  const { filePath, fetchType, isRelPath } = fetchInfo.parsed;
  // the following for text, json, blob, css
  let fetchedFile;
  const fileFetcher = isRelPath
    ? filepath => {
        return sendFileRequestToEditor(
          extractFileNameFromLocalFilePath(filepath),
          "LOAD_FILE",
          { fetchType }
        );
      }
    : fetchLocally;
  try {
    fetchedFile = await fileFetcher(filePath, fetchType);
  } catch (err) {
    return Promise.resolve(errorMessage(fetchInfo, err));
  }
  const assignVariable = (params, file) =>
    setVariableInWindow(params.parsed.varName, file);

  if (["text", "json", "blob", "arrayBuffer"].includes(fetchType)) {
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
    addCSS(fetchedFile, fetchInfo.parsed.filePath);
  } else {
    return Promise.resolve(errorMessage(fetchInfo, "unknown fetch type"));
  }
  return Promise.resolve(successMessage(fetchInfo));
}

export async function evaluateFetchText(fetchText, evalId) {
  const outputHistoryId = generateRandomId();
  const fetches = parseFetchCell(fetchText);
  const syntaxErrors = fetches.filter(fetchInfo => fetchInfo.parsed.error);
  if (syntaxErrors.length) {
    sendActionToEditor(
      addToConsoleHistory({
        historyType: "FETCH_CELL_INFO",
        value: syntaxErrors.map(fetchProgressInitialStrings),
        historyId: outputHistoryId,
        level: "ERROR"
      })
    );
    sendStatusResponseToEditor("ERROR", evalId);
    return Promise.resolve();
  }

  let progressStrings = fetches.map(fetchProgressInitialStrings);
  sendActionToEditor(
    addToConsoleHistory({
      historyType: "FETCH_CELL_INFO",
      value: progressStrings,
      historyId: outputHistoryId
    })
  );
  const fetchCalls = fetches.map((f, i) =>
    handleFetch(f).then(outcome => {
      progressStrings = progressStrings.map(entry => Object.assign({}, entry));
      progressStrings[i] = outcome;
      sendActionToEditor(
        updateConsoleEntry({
          historyId: outputHistoryId,
          value: progressStrings
        })
      );
      return outcome;
    })
  );

  const outcomes = await Promise.all(fetchCalls);
  const errors = outcomes.filter(f => f.text.startsWith("ERROR"));
  const hasError = errors.length > 0;

  sendActionToEditor(
    updateConsoleEntry({
      historyId: outputHistoryId,
      value: outcomes,
      level: hasError ? "ERROR" : undefined
    })
  );
  if (hasError) {
    sendStatusResponseToEditor("ERROR", evalId);
  } else {
    sendStatusResponseToEditor("SUCCESS", evalId);
  }
}
