import { flushServerAutosave } from "./autosave-actions";
import { checkNotebookIsBasedOnLatestServerRevision } from "./server-save-actions";
import { connectionModeIsServer } from "../tools/server-tools";

export function handleEditorVisibilityChange(hidden) {
  return (dispatch, getState) => {
    const state = getState();
    if (
      connectionModeIsServer(state) &&
      state.userData.name &&
      state.notebookInfo.user_can_save
    ) {
      if (!hidden) {
        // check notebook consistency if we are returning to this
        // tab or browser
        dispatch(checkNotebookIsBasedOnLatestServerRevision());
      } else {
        // flush any pending server autosave if we're navigating
        // away (this will help ensure that a notebook shared
        // with others e.g. with a copypaste link will be up-to-date)
        flushServerAutosave();
      }
    }
  };
}
