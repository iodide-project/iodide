import createHistoryItem from "../tools/create-history-item";

export function evalTypeConsoleError(evalType) {
  return {
    type: "ADD_TO_CONSOLE_HISTORY",
    ...createHistoryItem({
      historyType: "CONSOLE_OUTPUT",
      value: new Error(`eval type ${evalType} is not defined`),
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
