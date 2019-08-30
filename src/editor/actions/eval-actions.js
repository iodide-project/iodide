import {
  getChunkContainingLine,
  selectionToChunks,
  removeDuplicatePluginChunksInSelectionSet
} from "../iomd-tools/iomd-selection";

import { NONCODE_EVAL_TYPES } from "../state-schemas/state-schema";

const chunkNotSkipped = chunk =>
  !(
    chunk.evalFlags.includes("skipRunAll") ||
    chunk.evalFlags.includes("skiprunall")
  );
const chunkNotRunnable = ({ chunkType, chunkContent }) =>
  NONCODE_EVAL_TYPES.includes(chunkType) || chunkContent.trim() === "";

export function setKernelState(kernelState) {
  return {
    type: "SET_KERNEL_STATE",
    kernelState
  };
}

export function addToEvalQueue(chunk) {
  return (dispatch, getState) => {
    if (chunkNotRunnable(chunk) || getState().modalState !== "MODALS_CLOSED")
      return;
    dispatch({ type: "ADD_TO_EVAL_QUEUE", chunk });
  };
}

export function evaluateText() {
  return (dispatch, getState) => {
    const { iomdChunks, editorSelections, editorCursor } = getState();

    if (editorSelections.length === 0) {
      const activeChunk = getChunkContainingLine(iomdChunks, editorCursor.line);
      dispatch(addToEvalQueue(activeChunk));
    } else {
      const selectionChunkSet = editorSelections
        .map(selection => ({
          start: selection.start.line,
          end: selection.end.line,
          selectedText: selection.selectedText
        }))
        .map(selection => selectionToChunks(selection, iomdChunks))
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
      .iomdChunks.filter(chunkNotSkipped)
      .forEach(chunk => dispatch(addToEvalQueue(chunk)));
  };
}
