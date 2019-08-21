import { addToEvalQueue } from "../../actions/eval-actions";
import {
  clearConsoleTextCache,
  resetHistoryCursor,
  resetConsoleText
} from "./actions";

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
