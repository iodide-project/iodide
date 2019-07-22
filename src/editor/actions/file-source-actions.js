import {
  saveFileSourceToServer,
  deleteFileSourceFromServer
} from "../../shared/utils/file-source-operations";

import {
  saveFileUpdateOperationToServer,
  getFileUpdateOperationFromServer
} from "../../shared/utils/file-update-operation-operations";

const UPDATE_INTERVAL_OPTIONS = {
  never: undefined,
  daily: "1 day, 0:00:00",
  weekly: "7 days, 0:00:00"
};

export function addFileSource(
  sourceURL,
  destinationFilename,
  updateInterval = undefined
) {
  return async (dispatch, getState) => {
    const notebookID = getState().notebookInfo.notebook_id;
    const convertedUpdateInterval = UPDATE_INTERVAL_OPTIONS[updateInterval];
    const response = await saveFileSourceToServer(
      notebookID,
      sourceURL,
      destinationFilename,
      convertedUpdateInterval
    );

    const fileSourceID = response.id;

    dispatch({
      type: "ADD_FILE_SOURCE_TO_NOTEBOOK",
      sourceURL,
      fileSourceID,
      destinationFilename,
      updateInterval
    });
    return response;
  };
}

export function createFileUpdateOperation(fileSourceID) {
  return async () => {
    let response;
    try {
      response = await saveFileUpdateOperationToServer(fileSourceID);
    } catch (err) {
      console.error(err);
    }
    // add status and latestFileUpdateOperationID
    console.log(response);
  };
}

export function pollForFileUpdateOperationStatus(fileUpdateOperationID) {
  return async () => {
    const response = getFileUpdateOperationFromServer(fileUpdateOperationID);
    console.log(response);
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
