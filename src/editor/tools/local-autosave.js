import db from "./local-autosave-client";
import { connectionModeIsServer } from "./server-tools";

function getAutosaveKey(state) {
  const documentId = connectionModeIsServer(state)
    ? state.notebookInfo.notebook_id
    : `standalone-${window.location.pathname}`;
  return `autosave-${documentId}`;
}

async function getLocalAutosave(state) {
  const autosaveKey = getAutosaveKey(state);
  const autosave = await db.autosave.get(autosaveKey);
  return autosave || {};
}

async function haveLocalAutosave(state) {
  const localAutosave = await getLocalAutosave(state);
  return Object.keys(localAutosave).length > 0;
}

async function clearLocalAutosave(state) {
  const autosaveKey = await getAutosaveKey(state);
  await db.autosave.delete(autosaveKey);
}

async function writeLocalAutosave(state) {
  const autosaveKey = getAutosaveKey(state);
  db.autosave.put(
    {
      iomd: state.iomd,
      title: state.title,
      parentRevisionId: state.notebookInfo.revision_id
    },
    autosaveKey
  );
}

export {
  getLocalAutosave,
  haveLocalAutosave,
  clearLocalAutosave,
  writeLocalAutosave
};
