import CodeMirror from "codemirror";
import { getUrlParams, objectToQueryString } from "../tools/query-param-tools";
import {
  getRevisionList,
  getRevisions,
  getRevisionIdsNeededForDisplay
} from "../tools/revision-history";

import {
  getNotebookID,
  getUserDataFromDocument,
  notebookIsATrial
} from "../tools/server-tools";
import {
  clearAutosave,
  getAutosaveJsmd,
  updateAutosave
} from "../tools/autosave";
import { loginToServer, logoutFromServer } from "../tools/login";

import { fetchWithCSRFTokenAndJSONContent } from "./../shared/fetch-with-csrf-token";

import { jsmdParser } from "./jsmd-parser";
import {
  getChunkContainingLine,
  selectionToChunks,
  removeDuplicatePluginChunksInSelectionSet
} from "./jsmd-selection";

import evalQueue from "./evaluation-queue";

import createHistoryItem from "../tools/create-history-item";

export function setKernelState(kernelState) {
  return {
    type: "SET_KERNEL_STATE",
    kernelState
  };
}

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

export function updateJsmdContent(text) {
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
  };
}

export function setPreviousAutosave(hasPreviousAutoSave) {
  return {
    type: "SET_PREVIOUS_AUTOSAVE",
    hasPreviousAutoSave
  };
}

export function loadAutosave() {
  return (dispatch, getState) => {
    // jsmd, jsmdChunks
    getAutosaveJsmd(getState()).then(jsmd => {
      const jsmdChunks = jsmdParser(jsmd);
      dispatch({
        type: "REPLACE_NOTEBOOK_CONTENT",
        jsmd,
        jsmdChunks
      });
      dispatch(setPreviousAutosave(false));
    });
  };
}

export function discardAutosave() {
  return (dispatch, getState) => {
    clearAutosave(getState());
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

export function changePageTitle(title) {
  return {
    type: "CHANGE_PAGE_TITLE",
    title
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

export function addLanguage(languageDefinition) {
  return dispatch => {
    const { codeMirrorMode } = languageDefinition;
    CodeMirror.requireMode(codeMirrorMode, () => {});
    dispatch({
      type: "ADD_LANGUAGE_TO_EDITOR",
      languageDefinition
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
      evalQueue.evaluate(activeChunk, dispatch);
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
        selection.forEach(chunk => evalQueue.evaluate(chunk, dispatch));
      });
    }
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

export const nonRunnableChunkType = ["md", "css", "raw", ""];

const chunkIsRunnable = chunk =>
  !nonRunnableChunkType.includes(chunk.chunkType);

const chunkNotSkipped = chunk =>
  !(
    chunk.evalFlags.includes("skipRunAll") ||
    chunk.evalFlags.includes("skiprunall")
  );

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
        .then(() => {
          const message = "Updated Notebook";
          updateAutosave(state, true);
          if (appMsg) {
            dispatch(
              updateAppMessages({
                message,
                messageType: "NOTEBOOK_SAVED"
              })
            );
          }
          dispatch({ type: "NOTEBOOK_SAVED" });
        })
        .catch(err => {
          throw Error(err);
        });
    }
    return createNewNotebookOnServer()(dispatch, getState);
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
