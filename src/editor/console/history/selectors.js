export const getHistoryInputByEvalId = (state, evalId) => {
  return state.history.filter(
    item => item.historyType === "CONSOLE_INPUT" && item.evalId === evalId
  )[0];
};
