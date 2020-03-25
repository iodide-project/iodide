import { getHistoryInputByEvalId } from "../console/history/selectors";

import { setHistoryItemScroll } from "../console/history/actions";

export function openScriptInNewTab(scriptUrl) {
  return () => {
    window.open(scriptUrl, "_blank");
  };
}

export function scrollToHistoryItemByEvalId(evalId) {
  return (dispatch, getState) => {
    const state = getState();
    const { historyId } = getHistoryInputByEvalId(state, evalId);
    dispatch(setHistoryItemScroll(historyId));
  };
}
