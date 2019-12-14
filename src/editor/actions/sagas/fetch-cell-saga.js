import { all, call, put } from "redux-saga/effects";

import parseFetchCell from "../fetch-cell-parser";
import {
  addToConsoleHistory,
  updateHistoryLineContent,
  updateHistoryEntryLevel
} from "../../console/history/actions";
import { evaluateLanguagePlugin } from "./language-plugin-saga";

import { triggerEvalFrameTask } from "./eval-frame-sender";

import {
  // errorMessage,
  genericFetch
  // successMessage,
  // syntaxErrorToString
} from "../../../shared/utils/fetch-tools";
import { loadFileFromServer } from "../../../shared/utils/file-operations";

export const errorTypeToString = {
  MISSING_FETCH_TYPE: "fetch type not specified",
  INVALID_FETCH_TYPE: "invalid fetch type",
  INVALID_FETCH_URL: "invalid fetch url",
  INVALID_VARIABLE_NAME: "invalid variable name"
};

const syntaxErrorToString = fetchInfo => `Syntax error, ${
  errorTypeToString[fetchInfo.parsed.error]
} in:
    "${fetchInfo.line}"`;

const fetchProgressInitialStrings = fetchInfo =>
  `fetching ${fetchInfo.parsed.fetchType} from ${fetchInfo.parsed.filePath}`;

function* handleValidFetch(fetchInfo, historyId, lineIndex) {
  const { filePath, fetchType, isRelPath, varName } = fetchInfo.parsed;
  const fileFetcher = isRelPath ? loadFileFromServer : genericFetch;

  let fetchedFile;
  try {
    fetchedFile = yield call(fileFetcher, filePath, fetchType);
  } catch (err) {
    yield put(
      updateHistoryLineContent(
        historyId,
        lineIndex,
        `ERROR: ${filePath}\n    ${err}`
      )
    );
    yield put(updateHistoryEntryLevel("ERROR"));
    throw new Error(`failed to fetch file; halting eval queue`);
  }

  if (["text", "json", "blob", "arrayBuffer", "bytes"].includes(fetchType)) {
    yield call(triggerEvalFrameTask, "ASSIGN_VARIABLE", {
      name: varName,
      value: fetchedFile
    });
  } else if (fetchType === "js") {
    yield call(triggerEvalFrameTask, "LOAD_SCRIPT", {
      script: fetchedFile
    });
  } else if (fetchType === "css") {
    yield call(triggerEvalFrameTask, "ADD_CSS", {
      css: fetchedFile,
      filePath
    });
  } else if (fetchType === "plugin") {
    yield call(evaluateLanguagePlugin, fetchedFile);
  }

  const ifVarSet = varName ? ` (var ${varName})` : "";

  yield put(
    updateHistoryLineContent(
      historyId,
      lineIndex,
      `SUCCESS: ${filePath} loaded${ifVarSet}`
    )
  );
}

export function* evaluateFetch(fetchText) {
  const fetches = parseFetchCell(fetchText);
  const syntaxErrors = fetches.filter(fetchInfo => fetchInfo.parsed.error);
  if (syntaxErrors.length) {
    yield put(
      addToConsoleHistory({
        historyType: "FETCH_CELL_INFO",
        content: syntaxErrors.map(syntaxErrorToString),
        level: "ERROR"
      })
    );
    throw new Error(`Syntax errors in fetch chunk; halting eval queue`);
  }

  const { historyId } = yield put(
    addToConsoleHistory({
      historyType: "FETCH_CELL_INFO",
      content: fetches.map(fetchProgressInitialStrings)
    })
  );

  yield all(
    fetches.map((fetchSpec, i) =>
      call(handleValidFetch, fetchSpec, historyId, i)
    )
  );
}
