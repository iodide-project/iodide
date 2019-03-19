import evalQueue from "./evaluation-queue";

export function evalConsoleInput(consoleText) {
  return (dispatch, getState) => {
    const state = getState();
    // exit if there is no code in the console to  eval
    if (!consoleText) {
      return undefined;
    }
    const evalLanguageId = state.languageLastUsed;

    dispatch({ type: "CLEAR_CONSOLE_TEXT_CACHE" });
    dispatch({ type: "RESET_HISTORY_CURSOR" });
    evalQueue.evaluate({
      chunkType: evalLanguageId,
      chunkId: undefined,
      chunkContent: consoleText,
      evalFlags: ""
    });
    dispatch({ type: "UPDATE_CONSOLE_TEXT", consoleText: "" });
    return Promise.resolve();
  };
}
