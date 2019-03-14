import _ from "lodash";
import {
  setMostRecentSavedContent,
  saveNotebookToServer,
  setConnectionStatus
} from "../actions/actions";
import { clearLocalAutosave } from "./local-autosave";

const SERVER_AUTOSAVE_TIMEOUT = 30000;

const updateServerAutosave = _.throttle(
  async (dispatch, getState) => {
    const state = getState();
    const { username: notebookOwner } = state.notebookInfo;
    const { name: thisUser } = state.userData;
    let validAutosave = false;
    if (
      thisUser !== undefined && // is this a logged-in-user?
      notebookOwner === thisUser // is this notebook owned by the current user?
    ) {
      try {
        await dispatch(saveNotebookToServer(false));
        validAutosave = true;
      } catch (err) {
        // FIXME: come up with a compelling error case
        dispatch(setConnectionStatus("CONNECTION_LOST"));
        // schedule another save to the server, in case the connection
        // comes back up
        updateServerAutosave(dispatch, getState);
        // console.error(Error(err.message));
      }
      if (validAutosave) {
        dispatch(setMostRecentSavedContent());
        // remove previous autosave if we've successfully saved.
        clearLocalAutosave(state);
        if (state.notebookInfo.connectionStatus !== "CONNECTION_ACTIVE") {
          dispatch(setConnectionStatus("CONNECTION_ACTIVE"));
        }
      }
    }
  },
  SERVER_AUTOSAVE_TIMEOUT,
  { leading: false }
);

export { updateServerAutosave };
