import {
  setPreviouslySavedJsmdToCurrentJsmd,
  saveNotebookToServer
} from "../actions/actions";

export function changeMadeToJsmd(state) {
  return state.previouslySavedJsmd !== state.jsmd;
}
export function checkForServerAutosave(store) {
  store.dispatch(setPreviouslySavedJsmdToCurrentJsmd());
  setInterval(() => {
    const state = store.getState();
    if (changeMadeToJsmd(state)) {
      store.dispatch(saveNotebookToServer(false));
      store.dispatch(setPreviouslySavedJsmdToCurrentJsmd());
    }
  }, 6000);
}
