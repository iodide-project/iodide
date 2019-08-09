import { getUrlParams, objectToQueryString } from "../tools/query-param-tools";
import { getNotebookID, getUserDataFromDocument } from "../tools/server-tools";

import { getChunkContainingLine } from "../iomd-tools/iomd-selection";

import { addAppMessageToConsoleHistory } from "./console-message-actions";

export function updateAppMessages(messageObj) {
  return dispatch => {
    const { message } = messageObj;
    let { messageType, when } = messageObj;
    if (when === undefined) when = new Date().toString();
    if (messageType === undefined) messageType = message;
    // add to eval history.
    dispatch(addAppMessageToConsoleHistory(messageType));
    dispatch({
      type: "UPDATE_APP_MESSAGES",
      message: { message, messageType, when }
    });
  };
}

export function updateIomdContent(text) {
  return { type: "UPDATE_IOMD_CONTENT", iomd: text };
}

export function toggleWrapInEditors() {
  return { type: "TOGGLE_WRAP_IN_EDITORS" };
}

export function saveNotebook() {
  return {
    type: "SAVE_NOTEBOOK"
  };
}

export function resetNotebook(userData = undefined) {
  // NB: this action creator is not used in the code, but is useful for tests
  return {
    type: "RESET_NOTEBOOK",
    userData: userData && getUserDataFromDocument()
  };
}

export function clearVariables() {
  return {
    type: "CLEAR_VARIABLES"
  };
}

export function updateTitle(title) {
  return dispatch => {
    dispatch({
      type: "UPDATE_NOTEBOOK_TITLE",
      title
    });
  };
}

export function setViewMode(viewMode) {
  return (dispatch, getState) => {
    const state = getState();
    const notebookId = getNotebookID(state);
    if (notebookId) {
      const params = getUrlParams();
      if (viewMode === "REPORT_VIEW") params.viewMode = "report";
      else delete params.viewMode;
      window.history.replaceState(
        {},
        "",
        `/notebooks/${notebookId}/?${objectToQueryString(params)}`
      );
    }
    dispatch({
      type: "SET_VIEW_MODE",
      viewMode
    });
  };
}

export function updateEditorCursor(line, col, forceUpdate = false) {
  return { type: "UPDATE_CURSOR", line, col, forceUpdate };
}

export function updateEditorSelections(selections) {
  return {
    type: "UPDATE_SELECTIONS",
    selections
  };
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
    dispatch(updateEditorCursor(targetChunk.endLine + 1, 0, true));
  };
}

export function updateNotebookInfo(notebookInfo) {
  return {
    type: "UPDATE_NOTEBOOK_INFO",
    notebookInfo
  };
}

export function toggleEditorLink() {
  return {
    type: "TOGGLE_EDITOR_LINK"
  };
}
