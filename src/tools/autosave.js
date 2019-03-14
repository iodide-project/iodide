import { getLocalAutosaveState, updateLocalAutosave } from "./local-autosave";
import {
  initializeServerAutoSave,
  scheduleServerAutoSave
} from "./server-autosave";
import { connectionModeIsServer } from "./server-tools";

// attempts to update local autosave, if we are in a state to do so
// returns "RETRY" if we should retry
export async function checkUpdateAutoSave(state) {
  // waiting for notebook consistency check to finish, try again later
  if (state.checkingRevisionIsLatest) {
    return "RETRY";
  }

  // notebook revision on display is not latest, don't autosave
  if (state.notebookInfo && state.notebookInfo.revision_is_latest === false) {
    return "NOOP";
  }

  // if we have a previous autosave, don't overwrite it. also, don't
  // autosave the "new" document, as anything beyond an initial sketch
  // is usually saved at least once
  if (
    state.hasPreviousAutoSave ||
    (connectionModeIsServer(state) && !state.notebookInfo.notebook_id)
  ) {
    return "NOOP";
  }

  const autosaveState = await getLocalAutosaveState(state);

  // original document got lost somehow (or never existed), completely
  // overwrite the key
  if (!autosaveState || !autosaveState.originalCopy) {
    return "UPDATE_WITH_NEW_COPY";
  }

  if (state.jsmd !== autosaveState.dirtyCopy) {
    // dirty copy has been updated, save it and queue
    // an update to the server
    return "UPDATE";
  }

  // some case which shouldn't happen
  return "NOOP";
}

let autoSaveTimeout;

async function updateAutoSave(store, _scheduleUpdateAutoSave) {
  autoSaveTimeout = undefined;

  const state = store.getState();
  const autoSaveStatus = await checkUpdateAutoSave(state);
  switch (autoSaveStatus) {
    case "RETRY":
      _scheduleUpdateAutoSave();
      break;
    case "UPDATE_WITH_NEW_COPY":
      updateLocalAutosave(state, true);
      scheduleServerAutoSave(store);
      break;
    case "UPDATE":
      updateLocalAutosave(state, false);
      scheduleServerAutoSave(store);
      break;
    default:
      break;
  }
}

export function subscribeToAutoSave(store) {
  initializeServerAutoSave(store);

  function scheduleUpdateAutoSave() {
    // Update autosave on a timeout so repeated keystrokes over
    // the course of a second don't trigger repeated saves
    if (!autoSaveTimeout) {
      autoSaveTimeout = setTimeout(
        updateAutoSave,
        1000,
        store,
        scheduleUpdateAutoSave
      );
    }
  }

  store.subscribe(scheduleUpdateAutoSave);
}
