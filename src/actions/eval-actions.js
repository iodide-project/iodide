import {
  getChunkContainingLine,
  selectionToChunks,
  removeDuplicatePluginChunksInSelectionSet
} from "./jsmd-selection";
import { setKernelState } from "./actions";
import evalQueue from "./evaluation-queue";

import { NONCODE_EVAL_TYPES } from "../state-schemas/state-schema";

const chunkIsRunnable = chunk => !NONCODE_EVAL_TYPES.includes(chunk.chunkType);

const chunkNotSkipped = chunk =>
  !(
    chunk.evalFlags.includes("skipRunAll") ||
    chunk.evalFlags.includes("skiprunall")
  );

export function evaluateText() {
  return (dispatch, getState) => {
    const {
      jsmdChunks,
      kernelState,
      editorSelections,
      editorCursor
    } = getState();

    if (kernelState !== "KERNEL_BUSY") dispatch(setKernelState("KERNEL_BUSY"));

    if (editorSelections.length === 0) {
      const activeChunk = getChunkContainingLine(jsmdChunks, editorCursor.line);
      evalQueue.evaluate(activeChunk);
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
        selection.forEach(chunk => evalQueue.evaluate(chunk));
      });
    }
  };
}

export function evaluateNotebook(evalQueueInstance = evalQueue) {
  return (dispatch, getState) => {
    const { jsmdChunks, kernelState } = getState();

    if (kernelState !== "KERNEL_BUSY") dispatch(setKernelState("KERNEL_BUSY"));

    jsmdChunks.forEach(chunk => {
      if (chunkIsRunnable(chunk) && chunkNotSkipped(chunk)) {
        evalQueueInstance.evaluate(chunk);
      }
    });
  };
}
