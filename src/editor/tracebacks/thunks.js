import { getTracebackItemById } from "./selectors";
import {
  getHistoryInputByEvalId,
  getChunkStartlineInEditorByEvalId
} from "../console/history/selectors";

import { setErrorInEditor } from "../actions/editor-actions";

import { setHistoryItemScroll } from "../console/history/actions";

export function goToTracebackItem(tracebackId) {
  return (dispatch, getState) => {
    const state = getState();

    const {
      tracebackType,
      scriptUrl,
      evalId,
      lineNumber,
      columnNumber,
      evalInUserCode
    } = getTracebackItemById(state, tracebackId);
    if (tracebackType === "FETCHED_JS_SCRIPT") {
      window.open(scriptUrl, "_blank");
      return;
    }

    const startLineInEditor = getChunkStartlineInEditorByEvalId(state, evalId);

    if (!evalInUserCode && startLineInEditor) {
      dispatch(setErrorInEditor(startLineInEditor + lineNumber, columnNumber));
      return;
    }

    const { historyId } = getHistoryInputByEvalId(state, evalId);
    dispatch(setHistoryItemScroll(historyId));
  };
}
