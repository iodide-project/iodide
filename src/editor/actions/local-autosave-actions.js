import { getLocalAutosave } from "../tools/local-autosave";
import { getRevisionID } from "../tools/server-tools";
import { updateJsmdContent, updateTitle } from "./actions";

// Check to see if we have an autosaved revision available, if so
// replace the notebook content with it
export function restoreLocalAutosave() {
  return async (dispatch, getState) => {
    const state = getState();

    // do not attempt to restore if this is not the user's notebook or we are
    // viewing an historical revision
    if (
      !state.userData.name ||
      !state.notebookInfo.user_can_save ||
      !state.notebookInfo.revision_is_latest
    ) {
      return;
    }

    const localAutosaveState = await getLocalAutosave(state);
    if (
      localAutosaveState.jsmd &&
      localAutosaveState.title &&
      localAutosaveState.parentRevisionId &&
      (localAutosaveState.jsmd !== state.jsmd ||
        localAutosaveState.title !== state.title)
    ) {
      const originalLoadedRevisionId = getRevisionID(state);

      dispatch(updateJsmdContent(localAutosaveState.jsmd));
      dispatch(updateTitle(localAutosaveState.title));
      dispatch({
        type: "UPDATE_REVISION_ID",
        id: localAutosaveState.parentRevisionId
      });
      dispatch({
        type: "UPDATE_NOTEBOOK_REVISION_IS_LATEST",
        revisionIsLatest:
          localAutosaveState.parentRevisionId === originalLoadedRevisionId
      });
    }
  };
}
