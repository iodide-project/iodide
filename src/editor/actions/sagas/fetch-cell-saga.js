import { all, call, put } from "redux-saga/effects";

import parseFetchCell from "../fetch-cell-parser";
import { addToConsoleHistory } from "../console-message-actions";
import { evaluateLanguagePlugin } from "./language-plugin-saga";

import { triggerEvalFrameTask } from "./eval-frame-sender";

import {
  errorMessage,
  genericFetch,
  successMessage,
  syntaxErrorToString
} from "../../../shared/utils/fetch-tools";
import { loadFileFromServer } from "../../../shared/utils/file-operations";

function fetchProgressInitialStrings(fetchInfo) {
  let text;
  if (fetchInfo.parsed.error) {
    text = `${syntaxErrorToString(fetchInfo)}`;
  } else {
    text = `fetching ${fetchInfo.parsed.fetchType} from ${fetchInfo.parsed.filePath}`;
  }
  return {
    text,
    id: fetchInfo.id
  };
}

function* handleValidFetch(fetchInfo, historyId, lineIndex) {
  const { filePath, fetchType, isRelPath } = fetchInfo.parsed;
  const fileFetcher = isRelPath ? loadFileFromServer : genericFetch;
  console.log("FETCH INFO ------------------", filePath, fetchInfo);

  let fetchedFile;
  try {
    fetchedFile = yield call(fileFetcher, filePath, fetchType);
  } catch (err) {
    yield put({
      type: "UPDATE_LINE_IN_HISTORY_ITEM_CONTENT",
      historyId,
      lineIndex,
      lineContent: errorMessage(fetchInfo, err).text
    });
    yield put({
      type: "UPDATE_VALUE_IN_HISTORY",
      historyItem: {
        historyId,
        level: "ERROR" // hasError ? "ERROR" : undefined
      }
    });
    throw new Error(`failed to fetch file; halting eval queue`);
    // return errorMessage(fetchInfo, err);
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
  }

  yield put({
    type: "UPDATE_LINE_IN_HISTORY_ITEM_CONTENT",
    historyId,
    lineIndex,
    lineContent: successMessage(fetchInfo).text
  });

  // return successMessage(fetchInfo);
}

export function* evaluateFetch(fetchText) {
  const fetches = parseFetchCell(fetchText);
  const syntaxErrors = fetches.filter(fetchInfo => fetchInfo.parsed.error);
  if (syntaxErrors.length) {
    yield put(
      addToConsoleHistory({
        historyType: "FETCH_CELL_INFO",
        content: syntaxErrors.map(fetchProgressInitialStrings).map(t => t.text),
        level: "ERROR"
      })
    );

    throw new Error(`Syntax errors in fetch chunk; halting eval queue`);
  }

  const progressStrings = fetches.map(fetchProgressInitialStrings);
  const { historyId } = yield put(
    addToConsoleHistory({
      historyType: "FETCH_CELL_INFO",
      content: progressStrings.map(t => t.text)
    })
  );

  // const outcomes =
  yield all(
    fetches.map((fetchSpec, i) =>
      call(handleValidFetch, fetchSpec, historyId, i)
    )
  );

  // const errors = outcomes.filter(f => f.text.startsWith("ERROR"));
  // const hasError = errors.length > 0;

  // yield put({
  //   type: "UPDATE_VALUE_IN_HISTORY",
  //   historyItem: {
  //     historyId,
  //     level: hasError ? "ERROR" : undefined
  //   }
  // });

  // if (hasError) {
  //   throw new Error(`Fetch outcome error; halting eval queue`);
  // }
}
