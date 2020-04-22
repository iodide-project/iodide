import generateRandomId from "../../../shared/utils/generate-random-id";

export const addToConsoleHistory = (
  historyItem,
  historyId = generateRandomId()
) => ({ type: "console/history/ADD", historyId, ...historyItem });

export const addAppMessageToConsoleHistory = content =>
  addToConsoleHistory({ content, historyType: "APP_MESSAGE" });

export const addEvalTypeConsoleErrorToHistory = evalType =>
  addToConsoleHistory({
    historyType: "CONSOLE_MESSAGE",
    content: `No evaluator available for chunks of type "${evalType}"`,
    level: "ERROR"
  });

export const addLoadingLanguageMsgToHistory = langDisplayName =>
  addToConsoleHistory({
    historyType: "CONSOLE_MESSAGE",
    content: `Loading ${langDisplayName} language plugin`,
    level: "LOG"
  });

export const addInputToConsole = (
  evalText,
  evalType,
  evalId,
  startLine,
  endLine,
  chunkId,
  historyId = generateRandomId()
) =>
  addToConsoleHistory(
    {
      historyType: "CONSOLE_INPUT",
      content: evalText,
      language: evalType,
      evalId,
      originalChunkId: chunkId,
      originalLines: { startLine, endLine }
    },
    historyId
  );

export const addOutputToConsole = (level, evalId) =>
  addToConsoleHistory({ historyType: "CONSOLE_OUTPUT", level, evalId });

export const addErrorStackToConsole = evalId =>
  addToConsoleHistory({
    historyType: "CONSOLE_OUTPUT_ERROR_STACK",
    evalId
  });

export const addPluginParseErrorToHistory = errorMessage =>
  addToConsoleHistory({
    historyType: "CONSOLE_MESSAGE",
    content: `plugin definition failed to parse:\n${errorMessage}`,
    level: "ERROR"
  });

export const clearHistory = () => ({ type: "console/history/CLEAR" });

export const updateHistoryEntryLevel = (historyId, level) => ({
  type: "console/history/UPDATE",
  historyItem: { historyId, level }
});

export const updateHistoryLineContent = (
  historyId,
  lineIndex,
  lineContent
) => ({
  type: "console/history/UPDATE_LINE",
  historyId,
  lineIndex,
  lineContent
});

export const setHistoryItemScroll = historyId => ({
  type: "console/history/SET_SCROLL_TARGET",
  historyId
});

export const clearHistoryItemScroll = () => setHistoryItemScroll(undefined);
//  ({
//    type: "console/history/CLEAR_SCROLL_TARGET"
//  });
