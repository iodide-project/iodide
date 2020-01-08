export const getHistoryItemById = (state, historyId) => {
  return state.history.filter(item => item.historyId === historyId)[0];
};

export const getHistoryInputByEvalId = (state, evalId) => {
  return state.history.filter(
    item => item.historyType === "CONSOLE_INPUT" && item.evalId === evalId
  )[0];
};
