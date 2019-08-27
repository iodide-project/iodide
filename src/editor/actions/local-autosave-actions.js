import { getLocalAutosave, clearLocalAutosave } from "../tools/local-autosave";
import { getRevisionID } from "../tools/server-tools";
import { updateNotebookInfo, updateTitle } from "./notebook-actions";
import { updateIomdContent } from "./editor-actions";

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
      localAutosaveState.iomd &&
      localAutosaveState.title &&
      localAutosaveState.parentRevisionId &&
      (localAutosaveState.iomd !== state.iomd ||
        localAutosaveState.title !== state.title)
    ) {
      const originalLoadedRevisionId = getRevisionID(state);

      dispatch(updateIomdContent(localAutosaveState.iomd));
      dispatch(updateTitle(localAutosaveState.title));
      dispatch(
        updateNotebookInfo({
          revision_id: localAutosaveState.parentRevisionId,
          revision_is_latest:
            localAutosaveState.parentRevisionId === originalLoadedRevisionId
        })
      );
    } else {
      // the local autosave is either corrupt or not at all different from what we had, just delete it
      await clearLocalAutosave(state);
    }
  };
}
