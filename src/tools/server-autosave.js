import {
  setMostRecentSavedContent,
  saveNotebookToServer,
  setConnectionStatus
} from "../actions/actions";
import { clearAutosave } from "./autosave";

const SERVER_AUTOSAVE_INTERVAL = 30000;

export function notebookChangedSinceSave(state) {
  const { previouslySavedContent: previous } = state;
  return previous.jsmd !== state.jsmd || previous.title !== state.title;
}

export function checkForServerAutosave(store) {
  store.dispatch(setMostRecentSavedContent());
  setInterval(async () => {
    const state = store.getState();
    const { username: notebookOwner } = state.notebookInfo;
    const { name: thisUser } = state.userData;
    let validAutosave = false;
    if (
      notebookChangedSinceSave(state) && // has the notebook changed?
      thisUser !== undefined && // is this a logged-in-user?
      notebookOwner === thisUser // is this notebook owned by the current user?
    ) {
      try {
        await store.dispatch(saveNotebookToServer(false));
        validAutosave = true;
      } catch (err) {
        // FIXME: come up with a compelling error case
        store.dispatch(setConnectionStatus("CONNECTION_LOST"));
        // console.error(Error(err.message));
      }
      if (validAutosave) {
        store.dispatch(setMostRecentSavedContent());
        // remove previous autosave if we've successfully saved.
        clearAutosave(state);
        if (state.notebookInfo.connectionStatus !== "CONNECTION_ACTIVE") {
          store.dispatch(setConnectionStatus("CONNECTION_ACTIVE"));
        }
      }
    }
  }, SERVER_AUTOSAVE_INTERVAL);
}
