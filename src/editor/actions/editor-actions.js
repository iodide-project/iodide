import { getChunkContainingLine } from "../iomd-tools/iomd-selection";

export function updateIomdContent(text) {
  return { type: "UPDATE_IOMD_CONTENT", iomd: text };
}

export function toggleWrapInEditors() {
  return { type: "TOGGLE_WRAP_IN_EDITORS" };
}

export function updateEditorSelections(selections) {
  return {
    type: "UPDATE_SELECTIONS",
    selections
  };
}

export function updateEditorCursor(line, col) {
  return { type: "UPDATE_CURSOR", line, col };
}

export function moveCursorToNextChunk() {
  return (dispatch, getState) => {
    const {
      editorSelections: selections,
      iomdChunks,
      editorCursor
    } = getState();
    const targetLine =
      selections.length === 0
        ? editorCursor.line
        : selections[selections.length - 1].end.line;

    const targetChunk = getChunkContainingLine(iomdChunks, targetLine);
    dispatch(updateEditorCursor(targetChunk.endLine + 1, 0));
  };
}
