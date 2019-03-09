import { getLocalAutosaveState, updateLocalAutosave } from "./local-autosave";
import {
  initializeServerAutoSave,
  scheduleServerAutoSave
} from "./server-autosave";
import { connectionModeIsServer } from "./server-tools";
import { store } from "../store";

let autoSaveTimeout;

export async function updateAutoSave(state) {
  autoSaveTimeout = undefined;

  // waiting for notebook consistency check to finish, try again later
  if (state.checkingNotebookConsistency) {
    autoSaveTimeout = setTimeout(async () => {
      updateAutoSave(store.getState());
    }, 1000);
    return;
  }

  // notebook revision on display is not latest, don't autosave
  if (state.notebookInfo && state.notebookInfo.revision_is_latest === false) {
    return;
  }

  // if we have a previous autosave, don't overwrite it. also, don't
  // autosave the "new" document, as anything beyond an initial sketch
  // is usually saved at least once
  if (
    state.hasPreviousAutoSave ||
    (connectionModeIsServer(state) && !state.notebookInfo.notebook_id)
  ) {
    return;
  }

  const autosaveState = await getLocalAutosaveState(state);

  // original document got lost somehow (or never existed), completely
  // overwrite the key
  const newCopy = !autosaveState || !autosaveState.originalCopy;

  if (newCopy || state.jsmd !== autosaveState.dirtyCopy) {
    // dirty copy has been updated, save it and queue
    // an update to the server
    updateLocalAutosave(state, newCopy);
    scheduleServerAutoSave();
  }
}

export function subscribeToAutoSave() {
  initializeServerAutoSave();

  function scheduleUpdateAutoSave() {
    // Update autosave on a timeout so repeated keystrokes over
    // the course of a second don't trigger repeated saves
    if (!autoSaveTimeout) {
      autoSaveTimeout = setTimeout(async () => {
        updateAutoSave(store.getState());
      }, 1000);
    }
  }

  store.subscribe(scheduleUpdateAutoSave);
}
