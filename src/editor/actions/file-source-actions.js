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
  return async dispatch => {
    let response;
    try {
      response = await saveFileUpdateOperationToServer(fileSourceID);
    } catch (err) {
      console.error(err);
      // TODO: do something here if it fails.
      return;
    }
    const lastRan = response.started;
    const lastFileUpdateOperationID = response.id;
    const responseFileSourceID = response.file_source_id;
    const lastFileUpdateOperationStatus = response.status;
    dispatch({
      type: "UPDATE_FILE_SOURCE",
      fileSourceID: responseFileSourceID,
      lastRan,
      lastFileUpdateOperationID,
      lastFileUpdateOperationStatus
    });
    // this is probably where we want to poll for the status.
    // add status, lastRan lastFileUpdateOperationID
    let statusUpdate = lastFileUpdateOperationStatus;
    while (statusUpdate === "pending") {
      // this while loop depends on whether the iteration's response
      // returns status ! == "pending". Thus we will disable
      // this eslint rule, as per the documentation for this
      // rule here, as suggested in https://eslint.org/docs/rules/no-await-in-loop
      /* eslint-disable no-await-in-loop */
      response = await getFileUpdateOperationFromServer(
        lastFileUpdateOperationID
      );
      // update response here;
      dispatch({
        type: "UPDATE_FILE_SOURCE",
        fileSourceID: response.file_source_id,
        lastRan: response.started,
        lastFileUpdateOperationID: response.id,
        lastFileUpdateOperationStatus: response.status
      });

      if (response.status !== "pending" && response.status !== "running") {
        statusUpdate = response.status;
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      /* eslint-enable no-await-in-loop */
    }
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
