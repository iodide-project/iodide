import {
  getChunkContainingLine,
  selectionToChunks,
  removeDuplicatePluginChunksInSelectionSet
} from "../jsmd-tools/jsmd-selection";

import { NONCODE_EVAL_TYPES } from "../state-schemas/state-schema";

const chunkNotSkipped = chunk =>
  !(
    chunk.evalFlags.includes("skipRunAll") ||
    chunk.evalFlags.includes("skiprunall")
  );
const chunkNotRunnable = chunk => NONCODE_EVAL_TYPES.includes(chunk.chunkType);

export function setKernelState(kernelState) {
  return {
    type: "SET_KERNEL_STATE",
    kernelState
  };
}

export function addToEvalQueue(chunk) {
  return dispatch => {
    if (chunkNotRunnable(chunk)) return;
    dispatch({ type: "ADD_TO_EVAL_QUEUE", chunk });
  };
}

export function evaluateText() {
  return (dispatch, getState) => {
    const { jsmdChunks, editorSelections, editorCursor } = getState();

    if (editorSelections.length === 0) {
      const activeChunk = getChunkContainingLine(jsmdChunks, editorCursor.line);
      dispatch(addToEvalQueue(activeChunk));
    } else {
      const selectionChunkSet = editorSelections
        .map(selection => ({
          start: selection.start.line,
          end: selection.end.line,
          selectedText: selection.selectedText
        }))
        .map(selection => selectionToChunks(selection, jsmdChunks))
        .map(removeDuplicatePluginChunksInSelectionSet());
      selectionChunkSet.forEach(selection => {
        selection.forEach(chunk => dispatch(addToEvalQueue(chunk)));
      });
    }
  };
}

export function evaluateNotebook() {
  return (dispatch, getState) => {
    getState()
      .jsmdChunks.filter(chunkNotSkipped)
      .forEach(chunk => dispatch(addToEvalQueue(chunk)));
  };
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

    dispatch({ type: "CLEAR_CONSOLE_TEXT_CACHE" });
    dispatch({ type: "RESET_HISTORY_CURSOR" });
    dispatch(addToEvalQueue(chunk));
    dispatch({ type: "UPDATE_CONSOLE_TEXT", consoleText: "" });
    return Promise.resolve();
  };
}
