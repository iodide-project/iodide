import { getUrlParams, objectToQueryString } from "../tools/query-param-tools";
import { getNotebookID, getUserDataFromDocument } from "../tools/server-tools";

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

export function updateNotebookInfo(notebookInfo) {
  return {
    type: "UPDATE_NOTEBOOK_INFO",
    notebookInfo
  };
}
