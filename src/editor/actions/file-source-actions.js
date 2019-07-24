import {
  FILE_SOURCE_UPDATE_INTERVAL_MAP,
  reverseFileSourceUpdateInterval
} from "../state-schemas/state-schema";

import {
  saveFileSourceToServer,
  deleteFileSourceFromServer,
  getFileSourcesFromServer
} from "../../shared/utils/file-source-operations";

import { isLoggedIn } from "../tools/server-tools";

import {
  saveFileUpdateOperationToServer,
  getFileUpdateOperationFromServer
} from "../../shared/utils/file-update-operation-operations";

export function getFileSources() {
  return async (dispatch, getState) => {
    const state = getState();
    const loggedIn = isLoggedIn(state);
    const notebookID = getState().notebookInfo.notebook_id;
    const response = await getFileSourcesFromServer(notebookID, loggedIn);
    const fileSources = response.map(f => {
      const fileSource = Object.assign({}, f);
      fileSource.update_interval = reverseFileSourceUpdateInterval(
        f.update_interval
      );
      return fileSource;
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
    const convertedUpdateInterval =
      FILE_SOURCE_UPDATE_INTERVAL_MAP[updateInterval];
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
