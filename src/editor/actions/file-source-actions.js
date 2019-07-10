import {
  saveFileSourceToServer,
  deleteFileSourceFromServer
} from "../../shared/utils/file-source-operations";

export function addFileSource(
  sourceURL,
  destinationFilename,
  frequency = "never"
) {
  return async (dispatch, getState) => {
    const notebookID = getState().notebookInfo.notebook_id;
    const response = await saveFileSourceToServer(
      notebookID,
      sourceURL,
      destinationFilename,
      "1 day, 0:00:00"
    );

    const fileSourceID = response.id;

    dispatch({
      type: "ADD_FILE_SOURCE_TO_NOTEBOOK",
      sourceURL,
      fileSourceID,
      destinationFilename,
      frequency
    });
    return response;
  };
}

export function deleteFileSource(fileSourceID) {
  return async dispatch => {
    const response = await deleteFileSourceFromServer(fileSourceID);
    // remove the listed file source from notebook.
    dispatch({
      type: "DELETE_FILE_SOURCE_FROM_NOTEBOOK",
      fileSourceID
    });
    return response;
  };
}
