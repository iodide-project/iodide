import {
  getChunkContainingLine,
  selectionToChunks,
  removeDuplicatePluginChunksInSelectionSet
} from "./jsmd-selection";
import { setKernelState } from "./actions";

import {
  NONCODE_EVAL_TYPES,
  RUNNABLE_CHUNK_TYPES
} from "../state-schemas/state-schema";
import createHistoryItem from "../tools/create-history-item";

const chunkNotSkipped = chunk =>
  !(
    chunk.evalFlags.includes("skipRunAll") ||
    chunk.evalFlags.includes("skiprunall")
  );

const languageReady = (state, lang) =>
  Object.keys(state.loadedLanguages).includes(lang);
const languageKnown = (state, lang) =>
  Object.keys(state.languageDefinitions).includes(lang);
const chunkNotRunnable = chunk => NONCODE_EVAL_TYPES.includes(chunk.chunkType);
const definedEvalType = (state, lang) =>
  languageReady(state, lang) ||
  languageKnown(state, lang) ||
  RUNNABLE_CHUNK_TYPES.includes(lang) ||
  NONCODE_EVAL_TYPES.includes(lang);

function addToEvalQueue(chunk) {
  return (dispatch, getState) => {
    if (chunkNotRunnable(chunk)) return;
    if (!definedEvalType(getState(), chunk.chunkType)) {
      dispatch({
        type: "ADD_TO_CONSOLE_HISTORY",
        ...createHistoryItem({
          historyType: "CONSOLE_OUTPUT",
          value: new Error(`eval type ${chunk.evalType} is not defined`),
          level: "ERROR"
        })
      });
      return;
    }

    dispatch({ type: "ADD_TO_EVAL_QUEUE", chunk });
  };
}

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
    const { jsmdChunks, kernelState } = getState();

    if (kernelState !== "KERNEL_BUSY") dispatch(setKernelState("KERNEL_BUSY"));
    jsmdChunks
      .filter(chunkNotSkipped)
      .forEach(chunk => dispatch(addToEvalQueue(chunk)));
  };
}
