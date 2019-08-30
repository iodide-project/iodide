import generateRandomId from "../../shared/utils/generate-random-id";

export const addToConsoleHistory = (
  historyItem,
  historyId = generateRandomId()
) => ({ type: "ADD_TO_CONSOLE_HISTORY", historyId, ...historyItem });

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

export const addInputToConsole = (evalText, evalType) =>
  addToConsoleHistory({
    historyType: "CONSOLE_INPUT",
    content: evalText,
    language: evalType
  });

export const addPluginParseErrorToHistory = errorMessage =>
  addToConsoleHistory({
    historyType: "CONSOLE_MESSAGE",
    content: `plugin definition failed to parse:\n${errorMessage}`,
    level: "ERROR"
  });
