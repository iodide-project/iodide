import { all, call, put } from "redux-saga/effects";

import generateRandomId from "../../../shared/utils/generate-random-id";
import parseFetchCell from "../fetch-cell-parser";
import { addToConsoleHistory } from "../console-message-actions";
import { loadFile } from "../file-request-actions";
import { evaluateLanguagePlugin } from "./language-plugin-saga";

import { triggerEvalFrameTask } from "./eval-frame-sender";

import {
  errorMessage,
  genericFetch,
  successMessage,
  syntaxErrorToString
} from "../../../shared/utils/fetch-tools";

function fetchProgressInitialStrings(fetchInfo) {
  let text;
  if (fetchInfo.parsed.error) text = `${syntaxErrorToString(fetchInfo)}\n`;
  else
    text = `fetching ${fetchInfo.parsed.fetchType} from ${fetchInfo.parsed.filePath}\n`;
  return {
    text,
    id: fetchInfo.id
  };
}

function* handleFetch(fetchInfo) {
  const extractFileNameFromLocalFilePath = filepath => {
    return filepath
      .split("files/")
      .slice(1)
      .join("");
  };
  if (fetchInfo.parsed.error !== undefined) {
    return errorMessage(fetchInfo, syntaxErrorToString(fetchInfo));
  }

  const { filePath, fetchType, isRelPath } = fetchInfo.parsed;
  const fileFetcher = isRelPath
    ? filepath => {
        loadFile(
          extractFileNameFromLocalFilePath(filepath),
          generateRandomId(),
          fetchType
        );
      }
    : genericFetch;

  let fetchedFile;
  try {
    fetchedFile = yield call(fileFetcher, filePath, fetchType);
  } catch (err) {
    return errorMessage(fetchInfo, err);
  }

  if (["text", "json", "blob", "arrayBuffer"].includes(fetchType)) {
    yield call(triggerEvalFrameTask, "ASSIGN_VARIABLE", {
      name: fetchInfo.parsed.varName,
      value: fetchedFile
    });
  } else if (fetchType === "js") {
    yield call(triggerEvalFrameTask, "LOAD_SCRIPT", {
      script: fetchedFile
    });
  } else if (fetchType === "css") {
    yield call(triggerEvalFrameTask, "ADD_CSS", {
      css: fetchedFile,
      filePath: fetchInfo.parsed.filePath
    });
  } else if (fetchType === "plugin") {
    yield call(evaluateLanguagePlugin, fetchedFile);
  } else {
    return errorMessage(fetchInfo, "unknown fetch type");
  }
  return successMessage(fetchInfo);
}

export function* evaluateFetch(fetchText) {
  const fetches = parseFetchCell(fetchText);
  const syntaxErrors = fetches.filter(fetchInfo => fetchInfo.parsed.error);
  if (syntaxErrors.length) {
    yield put(
      addToConsoleHistory({
        historyType: "FETCH_CELL_INFO",
        content: syntaxErrors
          .map(fetchProgressInitialStrings)
          .map(t => t.text)
          .join(""),
        level: "ERROR"
      })
    );

    return;
  }

  let progressStrings = fetches.map(fetchProgressInitialStrings);
  let outputHistoryId = yield put(
    addToConsoleHistory({
      historyType: "FETCH_CELL_INFO",
      content: progressStrings.map(t => t.text).join("")
    })
  );
  outputHistoryId = outputHistoryId.historyId;

  /* eslint-disable func-names */
  const outcomes = yield all(
    fetches.map(function*(f, i) {
      const outcome = yield call(handleFetch, f);
      progressStrings = progressStrings.map(entry => Object.assign({}, entry));
      progressStrings[i] = outcome;
      yield put({
        type: "UPDATE_VALUE_IN_HISTORY",
        historyItem: {
          historyId: outputHistoryId,
          content: progressStrings.map(t => t.text).join("")
        }
      });
    })
  );

  const errors = outcomes.filter(f => f.text.startsWith("ERROR"));
  const hasError = errors.length > 0;

  yield put({
    type: "UPDATE_VALUE_IN_HISTORY",
    historyItem: {
      historyId: outputHistoryId,
      context: outcomes.map(t => t.text).join(""),
      level: hasError ? "ERROR" : undefined
    }
  });
}
