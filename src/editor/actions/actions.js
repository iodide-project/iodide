import debounceAction from "debounce-action";
import { getUrlParams, objectToQueryString } from "../tools/query-param-tools";
import {
  getRevisionList,
  getRevisions,
  getRevisionIdsNeededForDisplay
} from "../tools/revision-history";

import {
  getNotebookID,
  getRevisionID,
  getUserDataFromDocument,
  notebookIsATrial
} from "../tools/server-tools";
import { checkUpdateAutosave } from "../tools/autosave";
import {
  getLocalAutosaveState,
  clearLocalAutosave,
  updateLocalAutosave
} from "../tools/local-autosave";
import { updateServerAutosave } from "./server-actions";
import { loginToServer, logoutFromServer } from "../../shared/utils/login";

import { fetchWithCSRFTokenAndJSONContent } from "../../shared/fetch-with-csrf-token";

import { jsmdParser } from "../jsmd-tools/jsmd-parser";
import { getChunkContainingLine } from "../jsmd-tools/jsmd-selection";

import createHistoryItem from "../../shared/utils/create-history-item";

export function updateAppMessages(messageObj) {
  return dispatch => {
    const { message } = messageObj;
    let { messageType, when } = messageObj;
    if (when === undefined) when = new Date().toString();
    if (messageType === undefined) messageType = message;
    // add to eval history.
    dispatch({
      type: "ADD_TO_CONSOLE_HISTORY",
      ...createHistoryItem({
        historyType: "APP_MESSAGE",
        content: messageType
      })
    });
    dispatch({
      type: "UPDATE_APP_MESSAGES",
      message: { message, messageType, when }
    });
  };
}

// we debounce this action thunk so that it runs maximum once per
// second, so that each small change to the document doesn't hammer indexdb
export const updateAutosave = debounceAction(() => {
  return async (dispatch, getState) => {
    const state = getState();
    const autosaveStatus = await checkUpdateAutosave(state);
    switch (autosaveStatus) {
      case "RETRY":
        // debouncing should ensure we don't spin here
        updateAutosave(dispatch, getState);
        break;
      case "UPDATE_WITH_NEW_COPY":
        updateLocalAutosave(state, true);
        dispatch(updateServerAutosave(dispatch, getState));
        break;
      case "UPDATE":
        updateLocalAutosave(state, false);
        dispatch(updateServerAutosave(dispatch, getState));
        break;
      default:
        break;
    }
  };
}, 1000);

export function updateJsmdContent(text, autosaveChanges = true) {
  return (dispatch, getState) => {
    const jsmdChunks = jsmdParser(text);
    const reportChunkTypes = Object.keys(getState().languageDefinitions).concat(
      ["md", "html", "css"]
    );

    const reportChunks = jsmdChunks
      .filter(c => reportChunkTypes.includes(c.chunkType))
      .map(c => ({
        chunkContent: c.chunkContent,
        chunkType: c.chunkType,
        chunkId: c.chunkId,
        evalFlags: c.evalFlags
      }));

    dispatch({
      // this dispatch really just forwards to the eval frame
      type: "UPDATE_MARKDOWN_CHUNKS",
      reportChunks
    });
    dispatch({
      type: "UPDATE_JSMD_CONTENT",
      jsmd: text,
      jsmdChunks
    });

    // queue an update to autosave if applicable
    if (autosaveChanges) {
      dispatch(updateAutosave());
    }
  };
}

export function setPreviousAutosave(hasPreviousAutoSave) {
  return {
    type: "SET_PREVIOUS_AUTOSAVE",
    hasPreviousAutoSave
  };
}

export function loadAutosave() {
  return async (dispatch, getState) => {
    // jsmd, jsmdChunks
    const { dirtyCopy: jsmd } = await getLocalAutosaveState(getState());
    const jsmdChunks = jsmdParser(jsmd);
    dispatch({
      type: "REPLACE_NOTEBOOK_CONTENT",
      jsmd,
      jsmdChunks
    });
    dispatch(setPreviousAutosave(false));
  };
}

export function discardAutosave() {
  return (dispatch, getState) => {
    clearLocalAutosave(getState());
    dispatch(setPreviousAutosave(false));
  };
}

export function toggleWrapInEditors() {
  return { type: "TOGGLE_WRAP_IN_EDITORS" };
}

export function exportNotebook(exportAsReport = false) {
  return {
    type: "EXPORT_NOTEBOOK",
    exportAsReport
  };
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

export function changePageTitle(title, autosaveChanges = true) {
  return dispatch => {
    dispatch({
      type: "CHANGE_PAGE_TITLE",
      title
    });
    if (autosaveChanges) {
      dispatch(updateAutosave());
    }
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
      jsmdChunks,
      editorCursor
    } = getState();
    const targetLine =
      selections.length === 0
        ? editorCursor.line
        : selections[selections.length - 1].end.line;

    const targetChunk = getChunkContainingLine(jsmdChunks, targetLine);
    dispatch(updateEditorCursor(targetChunk.endLine + 1, 0, true));
  };
}

export function getNotebookSaveRequestOptions(state, options = undefined) {
  const data = {
    title: state.title,
    content: state.jsmd
  };
  if (options && options.forkedFrom !== undefined)
    data.forked_from = options.forkedFrom;
  const postRequestOptions = {
    body: JSON.stringify(data),
    method: "POST"
  };

  return postRequestOptions;
}

export function saveNotebookRequest(
  url,
  postRequestOptions,
  dispatch,
  appMsg = true
) {
  return fetchWithCSRFTokenAndJSONContent(url, postRequestOptions)
    .then(response => {
      if (!response.ok) {
        return response
          .json()
          .then(json => {
            // this is a horrible and obvious hack that will go away
            // when we don't provide an easy interface for the user
            // to double save a revision (i.e. we have provided
            // continuous autosave)
            if (json.non_field_errors && json.non_field_errors.length) {
              // no changes, not really an error, we'll silently pretend
              // this didn't happen
              return {};
            }
            // else, some kind of genuine error
            dispatch(
              updateAppMessages({
                message: "Error saving notebook.",
                messageType: "ERROR_SAVING_NOTEBOOK"
              })
            );
            throw response;
          })
          .catch(() => {
            throw response;
          });
      }
      return response.json();
    })
    .catch(err => {
      if (appMsg) {
        dispatch(
          updateAppMessages({
            message: `Error Saving Notebook.`,
            messageType: "ERROR_SAVING_NOTEBOOK"
          })
        );
      }
      throw new Error(err.message);
    });
}

export function createNewNotebookOnServer(options = { forkedFrom: undefined }) {
  return (dispatch, getState) => {
    const state = getState();
    const postRequestOptions = getNotebookSaveRequestOptions(state, {
      forkedFrom: options.forkedFrom
    });
    return saveNotebookRequest(
      "/api/v1/notebooks/",
      postRequestOptions,
      dispatch
    )
      .then(json => {
        const message = "Notebook saved to server";
        dispatch(
          updateAppMessages({
            message,
            messageType: `NOTEBOOK_SAVED`
          })
        );
        dispatch({ type: "ADD_NOTEBOOK_ID", id: json.id });
        window.history.replaceState({}, "", `/notebooks/${json.id}`);
        dispatch({ type: "NOTEBOOK_SAVED" });
      })
      .catch(() => {
        // do nothing here.
      });
  };
}

export function saveNotebookToServer(appMsg = true) {
  return (dispatch, getState) => {
    const state = getState();
    const notebookId = getNotebookID(state);
    const notebookInServer = Boolean(notebookId);
    if (notebookInServer) {
      // Update Exisiting Notebook
      return saveNotebookRequest(
        `/api/v1/notebooks/${notebookId}/revisions/`,
        getNotebookSaveRequestOptions(state),
        dispatch,
        appMsg
      )
        .then(newRevision => {
          const message = "Updated Notebook";
          updateLocalAutosave(state, true);
          if (appMsg) {
            dispatch(
              updateAppMessages({
                message,
                messageType: "NOTEBOOK_SAVED"
              })
            );
          }
          dispatch({ type: "NOTEBOOK_SAVED", newRevisionId: newRevision.id });
        })
        .catch(err => {
          throw Error(err);
        });
    }
    return createNewNotebookOnServer()(dispatch, getState);
  };
}

export function checkNotebookConsistency() {
  return (dispatch, getState) => {
    const state = getState();
    const notebookId = getNotebookID(state);
    if (!notebookId) {
      // no notebook id assigned yet, so not possible to be
      // out of date
      return;
    }
    dispatch({
      type: "UPDATE_CHECKING_NOTEBOOK_REVISION_IS_LATEST",
      checkingRevisionIsLatest: true
    });
    fetchWithCSRFTokenAndJSONContent(`/api/v1/notebooks/${notebookId}/`)
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(notebookData => {
        dispatch({
          type: "UPDATE_CHECKING_NOTEBOOK_REVISION_IS_LATEST",
          checkingRevisionIsLatest: false
        });
        dispatch({
          type: "UPDATE_NOTEBOOK_REVISION_IS_LATEST",
          revisionIsLatest:
            notebookData.latest_revision.id === getRevisionID(state)
        });
      });
    // currently not doing any error handling here-- if there
    // are problems here, chances are the user is working offline
    // which is, effectively, "at their own risk"
  };
}

function getRequiredRevisionContent(state, dispatch) {
  const contentIdsNeeded = getRevisionIdsNeededForDisplay(
    state.notebookHistory
  );

  // if we don't need anything, just return here!!
  if (!contentIdsNeeded.length) {
    return;
  }

  dispatch({
    type: "GETTING_REVISION_CONTENT"
  });
  getRevisions(getNotebookID(state), contentIdsNeeded)
    .then(revisions => {
      // reduce the revisions array into an object whose keys
      // are revision ids, and whose body is the content of
      // the revisions
      const revisionContent = revisions.reduce(
        (acc, r) => Object.assign(acc, { [r.id]: r.content }),
        {}
      );
      dispatch({
        type: "GOT_REVISION_CONTENT",
        revisionContent
      });
    })
    .catch(() => {
      dispatch({ type: "ERROR_GETTING_REVISION_CONTENT" });
    });
}

export function updateSelectedRevisionId(selectedRevisionId) {
  return (dispatch, getState) => {
    dispatch({
      type: "UPDATE_NOTEBOOK_HISTORY_BROWSER_SELECTED_REVISION_ID",
      selectedRevisionId
    });
    getRequiredRevisionContent(getState(), dispatch);
  };
}

export function getNotebookRevisionList() {
  return (dispatch, getState) => {
    dispatch({ type: "GETTING_NOTEBOOK_REVISION_LIST" });
    getRevisionList(getNotebookID(getState()))
      .then(revisionList => {
        dispatch({
          type: "GOT_NOTEBOOK_REVISION_LIST",
          revisionList
        });
        getRequiredRevisionContent(getState(), dispatch);
      })
      .catch(() => {
        dispatch({ type: "ERROR_GETTING_NOTEBOOK_REVISION_LIST" });
      });
  };
}

export function loginSuccess(userData) {
  return (dispatch, getState) => {
    dispatch({
      type: "LOGIN_SUCCESS",
      userData
    });
    if (notebookIsATrial(getState())) {
      createNewNotebookOnServer()(dispatch, getState);
    } else {
      dispatch(
        updateAppMessages({
          message: "You are logged in",
          messageType: "LOGGED_IN"
        })
      );
    }
  };
}

export function loginFailure() {
  return dispatch => {
    dispatch(
      updateAppMessages({
        message: "Login Failed",
        messageType: "LOGIN_FAILED"
      })
    );
  };
}

export function login(successCallback) {
  return dispatch => {
    const loginSuccessWrapper = userData => {
      dispatch(loginSuccess(userData));
      if (successCallback) successCallback(userData);
    };
    loginToServer(loginSuccessWrapper);
  };
}

function logoutSuccess(dispatch) {
  dispatch({ type: "LOGOUT" });
  dispatch(
    updateAppMessages({ message: "Logged Out", messageType: "LOGGED_OUT" })
  );
}

function logoutFailure(dispatch) {
  dispatch(
    updateAppMessages({
      message: "Logout Failed",
      messageType: "LOGOUT_FAILED"
    })
  );
}

export function logout() {
  return dispatch => {
    logoutFromServer(logoutSuccess, logoutFailure, dispatch);
  };
}

export function setModalState(modalState) {
  return {
    type: "SET_MODAL_STATE",
    modalState
  };
}

export function updateNotebookInfo(notebookInfo) {
  return {
    type: "UPDATE_NOTEBOOK_INFO",
    notebookInfo
  };
}

export function toggleHistoryModal() {
  return (dispatch, getState) => {
    const modalState =
      getState().modalState === "HISTORY_MODAL"
        ? "MODALS_CLOSED"
        : "HISTORY_MODAL";
    dispatch(setModalState(modalState));
  };
}

export function toggleHelpModal() {
  return (dispatch, getState) => {
    const modalState =
      getState().modalState === "HELP_MODAL" ? "MODALS_CLOSED" : "HELP_MODAL";
    dispatch(setModalState(modalState));
  };
}

export function toggleEditorLink() {
  return {
    type: "TOGGLE_EDITOR_LINK"
  };
}

export function saveEnvironment(updateObj, update) {
  return {
    type: "SAVE_ENVIRONMENT",
    updateObj,
    update
  };
}

export function setMostRecentSavedContent() {
  return {
    type: "SET_MOST_RECENT_SAVED_CONTENT"
  };
}

export function setConnectionStatus(status) {
  return {
    type: "SET_CONNECTION_STATUS",
    status
  };
}

export function addFile(filename, lastUpdated, fileID) {
  return {
    type: "ADD_FILE_TO_NOTEBOOK",
    filename,
    lastUpdated,
    fileID
  };
}

export function deleteFile(fileID) {
  return {
    type: "DELETE_FILE_FROM_NOTEBOOK",
    fileID
  };
}
