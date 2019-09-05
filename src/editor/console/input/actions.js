export function consoleHistoryStepBack(consoleCursorDelta) {
  return {
    type: "console/input/MOVE_HISTORY_CURSOR",
    consoleCursorDelta
  };
}
export function setConsoleLanguage(language) {
  return {
    type: "console/input/SET_LANGUAGE",
    language
  };
}
export function clearConsoleTextCache() {
  return { type: "console/input/CLEAR_TEXT_CACHE" };
}
export function resetHistoryCursor() {
  return { type: "console/input/RESET_HISTORY_CURSOR" };
}
export function updateConsoleText(consoleText) {
  return { type: "console/input/UPDATE_TEXT", consoleText };
}

export function resetConsoleText() {
  return updateConsoleText("");
}
