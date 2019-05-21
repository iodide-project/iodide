import debounceAction from "debounce-action";
import throttleAction from "throttle-action";
import { saveNotebookToServer } from "./server-save-actions";
import { writeLocalAutosave } from "../tools/local-autosave";

const SERVER_AUTOSAVE_TIMEOUT = 30000;

export const updateServerAutosave = throttleAction(
  () => {
    return async (dispatch, getState) => {
      const state = getState();
      const {
        username: notebookOwner,
        revision_is_latest: revisionIsLatest
      } = state.notebookInfo;
      const { name: thisUser } = state.userData;
      if (
        revisionIsLatest !== false &&
        thisUser !== undefined && // is this a logged-in-user?
        notebookOwner === thisUser // is this notebook owned by the current user?
      ) {
        try {
          await dispatch(saveNotebookToServer());
        } catch (err) {
          // schedule another save to the server, in case the connection
          // comes back up
          updateServerAutosave(dispatch, getState);
          // re-throw error so it appears on the console
          throw err;
        }
      }
    };
  },
  SERVER_AUTOSAVE_TIMEOUT,
  { leading: false }
);

export function flushServerAutosave() {
  updateServerAutosave.flush();
}

export const updateAutosave = debounceAction(() => {
  // we debounce this action thunk so that it runs maximum once per
  // second, so that each small change to the document doesn't hammer indexdb
  return async (dispatch, getState) => {
    const state = getState();
    // only save if:
    // * The user is logged in and owns the notebook
    // * This is the latest revision
    if (
      !state.userData.name ||
      !state.notebookInfo.user_can_save ||
      !state.notebookInfo.revision_is_latest
    ) {
      return;
    }
    // save a cache of the current notebook state to indexdb,
    // in case we suddenly die and we don't have a chance to update
    // on the server
    writeLocalAutosave(state);
    // enqueue an update to the server
    dispatch(updateServerAutosave(dispatch, getState));
  };
}, 1000);
