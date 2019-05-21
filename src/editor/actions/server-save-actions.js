import {
  createNotebookRequest,
  getNotebookRequest,
  updateNotebookRequest
} from "../../shared/server-api/notebook";
import { clearLocalAutosave } from "../tools/local-autosave";
import { getNotebookID, getRevisionID } from "../tools/server-tools";
import { updateJsmdContent, updateTitle } from "./actions";

function setServerSaveStatus(error) {
  let status;
  if (error) {
    if (error.status && error.status === "FORBIDDEN") {
      status = "ERROR_UNAUTHORIZED";
    } else if (
      error.status &&
      error.status === "BAD_REQUEST" &&
      error.detail &&
      error.detail.length &&
      error.detail[0].startsWith("Based on non-latest revision")
    ) {
      status = "ERROR_OUT_OF_DATE";
    } else {
      status = "ERROR_GENERAL";
    }
  } else {
    status = "OK";
  }
  return {
    type: "SET_SERVER_SAVE_STATUS",
    status
  };
}

export function createNewNotebookOnServer() {
  return async (dispatch, getState) => {
    const state = getState();
    const originalNotebookId = getNotebookID(state);
    try {
      const notebook = await createNotebookRequest(
        state.title,
        state.jsmd,
        originalNotebookId ? { forked_from: getRevisionID(state) } : {}
      );
      window.history.replaceState({}, "", `/notebooks/${notebook.id}/`);
      dispatch({ type: "ADD_NOTEBOOK_ID", id: notebook.id });
      dispatch({
        type: "NOTEBOOK_SAVED",
        newRevisionId: notebook.latest_revision.id
      });
      dispatch(setServerSaveStatus(undefined));

      // remove previous autosave if we've successfully saved.
      clearLocalAutosave(state);

      // update owner info, so we know that we can save
      if (originalNotebookId) {
        dispatch({
          type: "SET_NOTEBOOK_OWNER_IN_SESSION",
          owner: state.userData
        });
      }
    } catch (e) {
      dispatch(setServerSaveStatus(e));

      // re-throw so other consumers can handle the error (e.g. to pop up
      // an app message)
      throw e;
    }
  };
}

export function saveNotebookToServer(forceSave = false) {
  return async (dispatch, getState) => {
    const state = getState();
    const notebookId = getNotebookID(state);
    const notebookInServer = Boolean(notebookId);
    try {
      // no notebook exists yet on server, need to create one
      if (!notebookInServer) {
        dispatch(createNewNotebookOnServer());
        return;
      }
      // save existing revision
      const newRevision = await updateNotebookRequest(
        notebookId,
        forceSave ? undefined : getRevisionID(state),
        state.title,
        state.jsmd
      );
      dispatch({ type: "NOTEBOOK_SAVED", newRevisionId: newRevision.id });
      dispatch(setServerSaveStatus(undefined));

      // remove previous autosave if we've successfully saved.
      clearLocalAutosave(state);
    } catch (e) {
      dispatch(setServerSaveStatus(e));
      // re-throw so other consumers can handle the error (e.g. to pop up
      // an app message)
      throw e;
    }
  };
}

export function checkNotebookIsBasedOnLatestServerRevision() {
  return async (dispatch, getState) => {
    const state = getState();
    const notebookId = getNotebookID(state);
    if (!notebookId) {
      // no notebook id assigned yet, so not possible to be
      // out of date
      return;
    }
    try {
      const { latest_revision: latestRevision } = await getNotebookRequest(
        notebookId
      );
      // if the notebook on the server has the same content as locally,
      // just update the revision id (and update the revision is latest property in the unlikely event it got set to false)
      const sameContent =
        latestRevision.content === state.jsmd &&
        latestRevision.title === state.title;
      if (sameContent) {
        dispatch({
          type: "UPDATE_REVISION_ID",
          id: latestRevision.id
        });
      }
      dispatch({
        type: "UPDATE_NOTEBOOK_REVISION_IS_LATEST",
        revisionIsLatest:
          sameContent || latestRevision.id === getRevisionID(state)
      });
    } catch (e) {
      dispatch(setServerSaveStatus(e));
      // re-throw so other consumers can handle the error (e.g. to pop up
      // an app message)
      throw e;
    }
  };
}

export function revertToLatestServerRevision() {
  return async (dispatch, getState) => {
    const state = getState();
    const notebookId = getNotebookID(state);
    try {
      const { latest_revision: latestRevision } = await getNotebookRequest(
        notebookId
      );
      dispatch(updateJsmdContent(latestRevision.content));
      dispatch(updateTitle(latestRevision.title));
      dispatch({
        type: "UPDATE_NOTEBOOK_REVISION_IS_LATEST",
        revisionIsLatest: true
      });
      dispatch({ type: "NOTEBOOK_SAVED", newRevisionId: latestRevision.id });
      clearLocalAutosave(state);
      window.history.replaceState({}, "", `/notebooks/${notebookId}/`);
    } catch (e) {
      dispatch(setServerSaveStatus(e));

      // re-throw so other consumers can handle the error (e.g. to pop up
      // an app message)
      throw e;
    }
  };
}
