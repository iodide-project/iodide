import {
  getRevisionList,
  getRevisions
} from "../../shared/server-api/revisions";
import { getLocalAutosave } from "../tools/local-autosave";
import { getRevisionIdsNeededForDisplay } from "../tools/revision-history";
import { getNotebookID, isLoggedIn } from "../tools/server-tools";
import { updateAutosave } from "./autosave-actions";

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
  getRevisions(getNotebookID(state), contentIdsNeeded, isLoggedIn(state))
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

export function restoreSelectedRevision() {
  return (dispatch, getState) => {
    dispatch({
      type: "UPDATE_IOMD_CONTENT",
      iomd: getState().notebookHistory.revisionContent[
        getState().notebookHistory.selectedRevisionId
      ]
    });
    dispatch({
      type: "SET_MODAL_STATE",
      modalState: "MODALS_CLOSED"
    });
    dispatch(updateAutosave());
  };
}

export function getNotebookRevisionList() {
  return (dispatch, getState) => {
    dispatch({ type: "GETTING_NOTEBOOK_REVISION_LIST" });
    getRevisionList(getNotebookID(getState()), isLoggedIn(getState()))
      .then(revisionList => {
        getLocalAutosave(getState())
          .then(localAutosaveState => {
            const hasLocalOnlyChanges =
              "revisionContent" in getState().notebookHistory &&
              "iomd" in localAutosaveState &&
              revisionList[0].id in
                getState().notebookHistory.revisionContent &&
              localAutosaveState.iomd !==
                getState().notebookHistory.revisionContent[revisionList[0].id];
            dispatch({
              type: "UPDATE_NOTEBOOK_HISTORY",
              hasLocalOnlyChanges,
              revisionList,
              selectedRevisionId: hasLocalOnlyChanges
                ? undefined
                : revisionList[0].id
            });
            getRequiredRevisionContent(getState(), dispatch);
          })
          .catch(() => {
            dispatch({ type: "ERROR_GETTING_NOTEBOOK_REVISION_LIST" });
          });
      })
      .catch(() => {
        dispatch({ type: "ERROR_GETTING_NOTEBOOK_REVISION_LIST" });
      });
  };
}
