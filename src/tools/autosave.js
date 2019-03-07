import { getLocalAutosaveState, updateLocalAutosave } from "./local-autosave";
import {
  initializeServerAutoSave,
  scheduleServerAutoSave
} from "./server-autosave";
import { connectionModeIsServer } from "./server-tools";

let autoSaveTimeout;

export function subscribeToAutoSave(store) {
  initializeServerAutoSave(store);

  store.subscribe(() => {
    // use a subscribe event so we don't pay the penalty of checking
    // for jsmd changes unless user is actively interacting with the ui
    // also, throttle save events to one per second
    if (!autoSaveTimeout) {
      autoSaveTimeout = setTimeout(async () => {
        autoSaveTimeout = undefined;

        const state = store.getState();

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

        if (!autosaveState || !autosaveState.originalCopy) {
          // original document got lost somehow, save over it
          updateLocalAutosave(state, true);
          return;
        }

        if (store.getState().jsmd !== autosaveState.dirtyCopy) {
          // dirty copy has been updated, save it
          updateLocalAutosave(state, false);
          scheduleServerAutoSave(store);
        }
      }, 1000);
    }
  });
}
