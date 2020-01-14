export const getHistoryInputByEvalId = (state, evalId) => {
  return state.history.filter(
    item => item.historyType === "CONSOLE_INPUT" && item.evalId === evalId
  )[0];
};

// export const doesEvalIdChunkStillExist = (state, evalId) => {
//   const { originalChunkId } = getHistoryInputByEvalId(state, evalId);
//   const originalChunkArray = state.iomdChunks.filter(
//     chunk => chunk.chunkId === originalChunkId
//   );
// };

export const getChunkStartlineInEditorByEvalId = (state, evalId) => {
  const { originalChunkId } = getHistoryInputByEvalId(state, evalId);
  const originalChunkArray = state.iomdChunks.filter(
    chunk => chunk.chunkId === originalChunkId
  );

  return originalChunkArray.length > 0
    ? originalChunkArray[0].startLine
    : undefined;
};
