import {
  createNotebookRequest,
  getNotebookRequest,
  updateNotebookRequest
} from "../../shared/server-api/notebook";
import { clearLocalAutosave } from "../tools/local-autosave";
import { getNotebookID, getRevisionID } from "../tools/server-tools";
import { updateTitle, updateNotebookInfo } from "./notebook-actions";
import { updateIomdContent } from "./editor-actions";

function updateServerSaveStatus(error) {
  let serverSaveStatus;
  if (error.status && error.status === "FORBIDDEN") {
    serverSaveStatus = "ERROR_UNAUTHORIZED";
  } else if (
    error.status &&
    error.status === "BAD_REQUEST" &&
    error.detail &&
    error.detail.length &&
    error.detail[0].startsWith("Based on non-latest revision")
  ) {
    serverSaveStatus = "ERROR_OUT_OF_DATE";
  } else if (
    error.status &&
    error.status === "BAD_REQUEST" &&
    error.detail &&
    error.detail.non_field_errors &&
    error.detail.non_field_errors[0].startsWith(
      "Revision unchanged from previous"
    )
  ) {
    // this is actually a harmless error: it means we tried to save
    // an empty revision
    serverSaveStatus = "OK";
  } else {
    serverSaveStatus = "ERROR_GENERAL";
  }
  return updateNotebookInfo({ serverSaveStatus });
}

export function createNewNotebookOnServer() {
  return async (dispatch, getState) => {
    const state = getState();
    const originalNotebookId = getNotebookID(state);
    try {
      const notebook = await createNotebookRequest(
        state.title,
        state.iomd,
        originalNotebookId ? { forked_from: getRevisionID(state) } : {}
      );
      window.history.replaceState({}, "", `/notebooks/${notebook.id}/`);
      dispatch(
        updateNotebookInfo({
          notebook_id: notebook.id,
          revision_id: notebook.latest_revision.id,
          revision_is_latest: true,
          serverSaveStatus: "OK",
          tryItMode: false,
          user_can_save: true,
          username: state.userData.name // in case this notebook was forked
        })
      );

      // remove previous autosave if we've successfully saved.
      clearLocalAutosave(state);
    } catch (e) {
      dispatch(updateServerSaveStatus(e));

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
        state.iomd
      );
      dispatch(
        updateNotebookInfo({
          revision_id: newRevision.id,
          revision_is_latest: true,
          serverSaveStatus: "OK"
        })
      );

      // remove previous autosave if we've successfully saved.
      clearLocalAutosave(state);
    } catch (e) {
      dispatch(updateServerSaveStatus(e));
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
        latestRevision.content === state.iomd &&
        latestRevision.title === state.title;
      if (sameContent) {
        dispatch(
          updateNotebookInfo({
            revision_id: latestRevision.id,
            revision_is_latest: true
          })
        );
      } else {
        dispatch(
          updateNotebookInfo({
            revision_is_latest: latestRevision.id === getRevisionID(state)
          })
        );
      }
    } catch (e) {
      dispatch(updateServerSaveStatus(e));
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
      dispatch(updateIomdContent(latestRevision.content));
      dispatch(updateTitle(latestRevision.title));
      dispatch(
        updateNotebookInfo({
          revision_is_latest: true,
          revision_id: latestRevision.id
        })
      );
      clearLocalAutosave(state);
      window.history.replaceState({}, "", `/notebooks/${notebookId}/`);
    } catch (e) {
      dispatch(updateServerSaveStatus(e));

      // re-throw so other consumers can handle the error (e.g. to pop up
      // an app message)
      throw e;
    }
  };
}
