import createHistoryItem from "../../shared/utils/create-history-item";

export function evalTypeConsoleError(evalType) {
  return {
    type: "ADD_TO_CONSOLE_HISTORY",
    ...createHistoryItem({
      historyType: "CONSOLE_MESSAGE",
      content: `No evaluator available for chunks of type "${evalType}"`,
      level: "ERROR"
    })
  };
}

export function loadingLanguageConsoleMsg(langDisplayName) {
  return {
    type: "ADD_TO_CONSOLE_HISTORY",
    ...createHistoryItem({
      historyType: "CONSOLE_MESSAGE",
      content: `Loading ${langDisplayName} language plugin`,
      level: "LOG"
    })
  };
}

export function addInputToConsole(evalText, evalType) {
  return {
    type: "ADD_TO_CONSOLE_HISTORY",
    ...createHistoryItem({
      historyType: "CONSOLE_INPUT",
      content: evalText,
      language: evalType
    })
  };
}

export function pluginParseError(errorMessage) {
  return {
    type: "ADD_TO_CONSOLE_HISTORY",
    ...createHistoryItem({
      historyType: "CONSOLE_MESSAGE",
      content: `plugin definition failed to parse:\n${errorMessage}`,
      level: "ERROR"
    })
  };
}
