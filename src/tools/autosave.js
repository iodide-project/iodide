import { getLocalAutosaveState } from "./local-autosave";
import { connectionModeIsServer } from "./server-tools";

// attempts to update local autosave, if we are in a state to do so
// returns "RETRY" if we should retry
export async function checkUpdateAutosave(state) {
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
    state.hasPreviousAutosave ||
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

  // otherwise we can safely assume that an update is required
  return "UPDATE";
}
