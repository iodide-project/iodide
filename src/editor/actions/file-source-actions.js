import {
  saveFileSourceToServer,
  deleteFileSourceFromServer,
  getFileSourcesFromServer
} from "../../shared/utils/file-source-operations";

import {
  saveFileUpdateOperationToServer,
  getFileUpdateOperationFromServer
} from "../../shared/utils/file-update-operation-operations";

const UPDATE_INTERVAL_OPTIONS = {
  never: null,
  daily: "1 day, 0:00:00",
  weekly: "7 days, 0:00:00"
};

const reverseUpdateInterval = v => {
  if (v === null) return "never";
  if (v === "604800.0") return "weekly";
  return "daily";
};

export function getFileSources() {
  return async (dispatch, getState) => {
    const notebookID = getState().notebookInfo.notebook_id;
    const fileSources = await getFileSourcesFromServer(notebookID);
    fileSources.forEach(f => {
      f.update_interval = reverseUpdateInterval(f.update_interval);
    });
    // ok, if success
    dispatch({
      type: "UPDATE_FILE_SOURCES",
      fileSources
    });
    // ok, if failure
  };
}

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

export function deleteFileSource(fileSourceID) {
  return async dispatch => {
    const response = await deleteFileSourceFromServer(fileSourceID);
    dispatch({
      type: "DELETE_FILE_SOURCE_FROM_NOTEBOOK",
      fileSourceID
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
    dispatch({
      type: "UPDATE_FILE_SOURCE_STATUS",
      fileSourceID: response.file_source_id,
      fileUpdateOperation: response
    });
    let statusUpdate = response.status;
    const lastFileUpdateOperationID = response.id;
    while (statusUpdate === "pending" || statusUpdate === "running") {
      // this while loop depends on whether the iteration's response
      // returns status !== "pending". Thus we will disable
      // this eslint rule, as per the documentation for this
      // rule as suggested in https://eslint.org/docs/rules/no-await-in-loop
      /* eslint-disable no-await-in-loop */
      response = await getFileUpdateOperationFromServer(
        lastFileUpdateOperationID
      );
      dispatch({
        type: "UPDATE_FILE_SOURCE_STATUS",
        fileSourceID: response.file_source_id,
        fileUpdateOperation: response
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
