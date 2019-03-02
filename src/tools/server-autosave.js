import {
  setMostRecentSavedContent,
  saveNotebookToServer
} from "../actions/actions";

export function notebookChangedSinceSave(state) {
  const { previouslySavedContent: previous } = state;
  return previous.jsmd !== state.jsmd || previous.title !== state.title;
}

export function checkForServerAutosave(store) {
  store.dispatch(setMostRecentSavedContent());
  setInterval(() => {
    const state = store.getState();
    if (notebookChangedSinceSave(state)) {
      store.dispatch(saveNotebookToServer(false));
      store.dispatch(setMostRecentSavedContent());
    }
  }, 10000);
}
