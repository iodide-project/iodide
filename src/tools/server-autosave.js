import {
  setMostRecentSavedContent,
  saveNotebookToServer
} from "../actions/actions";
import { clearAutosave } from "./autosave";

export function notebookChangedSinceSave(state) {
  const { previouslySavedContent: previous } = state;
  return previous.jsmd !== state.jsmd || previous.title !== state.title;
}

export function checkForServerAutosave(store) {
  store.dispatch(setMostRecentSavedContent());
  setInterval(async () => {
    const state = store.getState();
    if (notebookChangedSinceSave(state)) {
      try {
        await store.dispatch(saveNotebookToServer(false));
        store.dispatch(setMostRecentSavedContent());
        // remove previous autosave if we've successfully saved.
        clearAutosave(state);
      } catch (err) {
        // FIXME: come up with a compelling error case
        console.error(Error(err.message));
      }
    }
  }, 10000);
}
