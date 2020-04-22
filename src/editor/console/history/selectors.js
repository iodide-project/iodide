export const getHistoryInputByEvalId = (state, evalId) => {
  return state.history.filter(
    item => item.historyType === "CONSOLE_INPUT" && item.evalId === evalId
  )[0];
};

export const chunkForEvalIdNotEdited = (state, evalId) => {
  const { originalChunkId } = getHistoryInputByEvalId(state, evalId);

  // if the original chunkId is still in the chunks array,
  // then the chunk has not been edited since eval
  return (
    state.iomdChunks.filter(chunk => chunk.chunkId === originalChunkId).length >
    0
  );
};

export const getChunkStartLineInEditorByEvalId = (state, evalId) => {
  const { originalChunkId } = getHistoryInputByEvalId(state, evalId);
  const originalChunkArray = state.iomdChunks.filter(
    chunk => chunk.chunkId === originalChunkId
  );

  return originalChunkArray.length > 0
    ? originalChunkArray[0].startLine
    : undefined;
};
