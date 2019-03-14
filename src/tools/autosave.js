import _ from "lodash";
import { getLocalAutosaveState, updateLocalAutosave } from "./local-autosave";
import { updateServerAutosave } from "./server-autosave";
import { connectionModeIsServer } from "./server-tools";

const AUTOSAVE_TIMEOUT = 1000;

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

  if (state.jsmd !== autosaveState.dirtyCopy) {
    // dirty copy has been updated, save it and queue
    // an update to the server
    return "UPDATE";
  }

  // some case which shouldn't happen
  return "NOOP";
}

export const updateAutosave = _.debounce(async (dispatch, getState) => {
  const state = getState();
  const autosaveStatus = await checkUpdateAutosave(state);
  switch (autosaveStatus) {
    case "RETRY":
      // debouncing should ensure we don't spin here
      updateAutosave(dispatch, getState);
      break;
    case "UPDATE_WITH_NEW_COPY":
      updateLocalAutosave(state, true);
      updateServerAutosave(dispatch, getState);
      break;
    case "UPDATE":
      updateLocalAutosave(state, false);
      updateServerAutosave(dispatch, getState);
      break;
    default:
      break;
  }
}, AUTOSAVE_TIMEOUT);
