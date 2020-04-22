import { all, call, put, select } from "redux-saga/effects";

import parseFetchCell from "../fetch-cell-parser";
import {
  addToConsoleHistory,
  updateHistoryLineContent,
  updateHistoryEntryLevel
} from "../../console/history/actions";
import { evaluateLanguagePlugin } from "./language-plugin-saga";

import { triggerEvalFrameTask } from "./eval-frame-sender";

import { genericFetch } from "../../../shared/utils/fetch-tools";
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

function* handleValidFetch(fetchInfo, historyId, lineIndex, chunkId) {
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
    const state = yield select();
    const language = state.loadedLanguages.js;
    yield call(
      triggerEvalFrameTask,
      "EVAL_CODE",
      {
        code: fetchedFile,
        language,
        chunkId
      },
      true,
      filePath
    );
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

export function* evaluateFetch(fetchText, chunkId) {
  const fetches = parseFetchCell(fetchText);
  const syntaxErrors = fetches.filter(fetchInfo => fetchInfo.parsed.error);
  if (syntaxErrors.length) {
    yield put(
      addToConsoleHistory({
        historyType: "CONSOLE_OUTPUT_FETCH",
        content: syntaxErrors.map(syntaxErrorToString),
        level: "ERROR"
      })
    );
    throw new Error(`Syntax errors in fetch chunk; halting eval queue`);
  }

  const { historyId } = yield put(
    addToConsoleHistory({
      historyType: "CONSOLE_OUTPUT_FETCH",
      content: fetches.map(fetchProgressInitialStrings)
    })
  );

  yield all(
    fetches.map((fetchSpec, lineIndex) =>
      call(handleValidFetch, fetchSpec, historyId, lineIndex, chunkId)
    )
  );
}
