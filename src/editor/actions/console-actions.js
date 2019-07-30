import { addToEvalQueue } from "./eval-actions";

export function consoleHistoryStepBack(consoleCursorDelta) {
  return {
    type: "CONSOLE_HISTORY_MOVE",
    consoleCursorDelta
  };
}

export function setConsoleLanguage(language) {
  return {
    type: "SET_CONSOLE_LANGUAGE",
    language
  };
}

export function clearConsoleTextCache() {
  return { type: "CLEAR_CONSOLE_TEXT_CACHE" };
}

export function resetHistoryCursor() {
  return { type: "RESET_HISTORY_CURSOR" };
}

export function updateConsoleText(consoleText) {
  return { type: "UPDATE_CONSOLE_TEXT", consoleText };
}

export function resetConsoleText() {
  return updateConsoleText("");
}

export function evalConsoleInput(consoleText) {
  return (dispatch, getState) => {
    // exit if there is no code in the console to  eval
    if (!consoleText) {
      return undefined;
    }
    const chunk = {
      chunkContent: consoleText,
      chunkType: getState().languageLastUsed
    };
    dispatch(clearConsoleTextCache());
    dispatch(resetHistoryCursor());
    dispatch(addToEvalQueue(chunk));
    dispatch(resetConsoleText());
    return Promise.resolve();
  };
}
