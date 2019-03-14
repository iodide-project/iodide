import db from "./local-autosave-client";
import { connectionModeIsServer } from "./server-tools";
import { setPreviousAutosave, loadAutosave } from "../actions/actions";

function getAutosaveKey(state) {
  const documentId = connectionModeIsServer(state)
    ? state.notebookInfo.notebook_id
    : `standalone-${window.location.pathname}`;
  return `autosave-${documentId}`;
}

async function getLocalAutosaveState(state) {
  const autosaveKey = getAutosaveKey(state);
  const autosave = await db.autosave.get(autosaveKey);
  return autosave;
}

async function getLocalAutosaveJsmd(state) {
  const autosaveState = await getLocalAutosaveState(state);
  return autosaveState.dirtyCopy;
}

function saveAutosaveState(autosaveKey, autosaveState) {
  db.autosave.put(autosaveState, autosaveKey);
}

async function checkForLocalAutosave(store) {
  const state = store.getState();
  const autosaveState = await getLocalAutosaveState(state);
  if (
    autosaveState &&
    autosaveState.dirtyCopy &&
    autosaveState.dirtyCopy !== autosaveState.originalCopy
  ) {
    const automaticallyApply =
      state.notebookInfo.username === state.userData.name;
    if (automaticallyApply) {
      store.dispatch(loadAutosave());
    }
    store.dispatch(setPreviousAutosave(true));
  }
}

async function clearLocalAutosave(state) {
  const autosaveKey = await getAutosaveKey(state);
  await db.autosave.delete(autosaveKey);
}

async function updateLocalAutosave(state, original) {
  const autosaveKey = getAutosaveKey(state);
  const { jsmd } = state;
  if (original) {
    // save (over) original, clear any existing dirty copy
    saveAutosaveState(autosaveKey, {
      originalCopy: jsmd,
      originalCopyRevision: state.notebookInfo.revision_id,
      originalSaved: new Date().toISOString()
    });
  } else {
    const autosaveState = await getLocalAutosaveState(state);
    saveAutosaveState(
      autosaveKey,
      Object.assign(autosaveState, {
        dirtyCopy: jsmd,
        dirtySaved: new Date().toISOString()
      })
    );
  }
}

export {
  checkForLocalAutosave,
  getLocalAutosaveJsmd,
  getLocalAutosaveState,
  clearLocalAutosave,
  updateLocalAutosave
};
