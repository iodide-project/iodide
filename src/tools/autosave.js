import db from "./autosave-client";
import { connectionModeIsServer } from "./server-tools";
import { setPreviousAutosave } from "../actions/actions";

function exportJsmd(state) {
  return state.jsmd;
}

function getAutosaveKey(state) {
  const documentId = connectionModeIsServer(state)
    ? state.notebookInfo.notebook_id
    : `standalone-${window.location.pathname}`;
  return `autosave-${documentId}`;
}

async function getAutosaveState(state) {
  const autosaveKey = getAutosaveKey(state);
  const autosave = await db.autosave.get(autosaveKey);
  return autosave;
}

async function getAutosaveJsmd(state) {
  const autosaveState = await getAutosaveState(state);
  return autosaveState.dirtyCopy;
}

function saveAutosaveState(autosaveKey, autosaveState) {
  db.autosave.put(autosaveState, autosaveKey);
}

async function checkForAutosave(store) {
  const state = store.getState();
  const autosaveState = await getAutosaveState(state);
  if (
    autosaveState &&
    autosaveState.dirtyCopy &&
    autosaveState.dirtyCopy !== autosaveState.originalCopy
  ) {
    store.dispatch(setPreviousAutosave(true));
  }
}

async function clearAutosave(state) {
  const autosaveKey = await getAutosaveKey(state);
  await db.autosave.delete(autosaveKey);
}

async function updateAutosave(state, original) {
  const autosaveKey = getAutosaveKey(state);
  const jsmd = exportJsmd(state);
  if (original) {
    // save (over) original, clear any existing dirty copy
    saveAutosaveState(autosaveKey, {
      originalCopy: jsmd,
      originalCopyRevision: state.notebookInfo.revision_id,
      originalSaved: new Date().toISOString()
    });
  } else {
    const autosaveState = await getAutosaveState(state);
    saveAutosaveState(
      autosaveKey,
      Object.assign(autosaveState, {
        dirtyCopy: jsmd,
        dirtySaved: new Date().toISOString()
      })
    );
  }
}

let autoSaveTimeout;

function subscribeToAutoSave(store) {
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

        const autosaveState = await getAutosaveState(state);

        if (!autosaveState || !autosaveState.originalCopy) {
          // original document got lost somehow, save over it
          updateAutosave(state, true);
          return;
        }

        const currentJsmd = exportJsmd(store.getState());
        if (currentJsmd !== autosaveState.dirtyCopy) {
          // dirty copy has been updated, save it
          updateAutosave(state, false);
        }
      }, 1000);
    }
  });
}

export {
  checkForAutosave,
  getAutosaveJsmd,
  getAutosaveState,
  clearAutosave,
  updateAutosave,
  subscribeToAutoSave
};
