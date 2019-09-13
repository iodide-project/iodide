import {
  FILE_SOURCE_UPDATE_SELECTOR_OPTIONS,
  FILE_SOURCE_UPDATE_INTERVAL_MAP,
  reverseFileSourceUpdateInterval
} from "../state-schemas/state-schema";

import { getFiles } from "./file-actions";

import {
  validateUrl as validateUrlForFileSource,
  validateFilename as validateFilenameForFileSource
} from "../components/modals/file-modal/manage-file-sources/validators";

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
    dispatch({
      type: "UPDATE_FILE_SOURCES",
      fileSources
    });
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
    // once file update operation completes, fetch all available files from the server.
    dispatch(getFiles());
  };
}

export function updateFileSourceInputFilename(filename) {
  return {
    type: "UPDATE_FILE_SOURCE_INPUT_FILENAME",
    filename
  };
}

export function updateFileSourceInputURL(url) {
  return {
    type: "UPDATE_FILE_SOURCE_INPUT_URL",
    url
  };
}

export function updateFileSourceInputUpdateInterval(updateInterval) {
  return {
    type: "UPDATE_FILE_SOURCE_INPUT_UPDATE_INTERVAL",
    updateInterval
  };
}

export function updateFileSourceInputStatusMessage(statusMessage) {
  return {
    type: "UPDATE_FILE_SOURCE_INPUT_STATUS_MESSAGE",
    statusMessage
  };
}

export function updateFileSourceInputStatusType(statusType) {
  return {
    type: "UPDATE_FILE_SOURCE_INPUT_STATUS_TYPE",
    statusType
  };
}

export function setConfirmDeleteID(confirmDeleteID) {
  return {
    type: "UPDATE_FILE_SOURCE_INPUT_CONFIRM_DELETE_ID",
    confirmDeleteID
  };
}

export function setIsDeletingAnimationID(isDeletingAnimationID) {
  return {
    type: "UPDATE_FILE_SOURCE_INPUT_SET_IS_DELETING_ANIMATION_ID",
    isDeletingAnimationID
  };
}

export function updateFileSourceStatusVisibility(statusIsVisible) {
  return {
    type: "UPDATE_FILE_SOURCE_STATUS_VISIBILITY",
    statusIsVisible
  };
}

export function validateAndSubmitFileSourceInputs(
  url,
  filename,
  updateInterval
) {
  return async dispatch => {
    dispatch(updateFileSourceStatusVisibility(true));
    dispatch(updateFileSourceInputStatusMessage("adding file source ..."));
    dispatch(updateFileSourceInputStatusType("LOADING"));

    if (url === "" || filename === "") {
      dispatch(updateFileSourceInputStatusType("ERROR"));
      dispatch(
        updateFileSourceInputStatusMessage(
          "must include source url & desired filename"
        )
      );
    } else if (!validateUrlForFileSource(url)) {
      dispatch(updateFileSourceInputStatusType("ERROR"));
      dispatch(updateFileSourceInputStatusMessage("invalid URL"));
    } else if (!validateFilenameForFileSource(filename)) {
      dispatch(updateFileSourceInputStatusType("ERROR"));
      dispatch(updateFileSourceInputStatusMessage("invalid filename"));
    } else {
      let request;
      try {
        request = await dispatch(addFileSource(url, filename, updateInterval));
      } catch (err) {
        dispatch(updateFileSourceInputStatusType("ERROR"));
        dispatch(updateFileSourceInputStatusMessage(err.message));
      }
      if (request) {
        dispatch(updateFileSourceInputStatusType("SUCCESS"));
        dispatch(updateFileSourceInputStatusMessage("added file source"));
        dispatch(updateFileSourceInputURL(""));
        dispatch(updateFileSourceInputFilename(""));
        dispatch(
          updateFileSourceInputUpdateInterval(
            FILE_SOURCE_UPDATE_SELECTOR_OPTIONS[0].key
          )
        );
      }
    }
  };
}

// used in the manage file sources modal in the useEffect.
export function clearFileSourceInputUpdateStatus() {
  return (dispatch, getState) => {
    const { statusIsVisible, statusType } = getState().fileSources;
    // clear status.type if not NONE after k seconds.
    if (statusIsVisible) {
      // change class?
      if (statusType === "SUCCESS" || statusType === "ERROR") {
        setTimeout(() => {
          dispatch(updateFileSourceStatusVisibility(false));
        }, 4000);
        // wait for the status visibility transition to finish.
        setTimeout(() => {
          dispatch(updateFileSourceInputStatusType("NONE"));
          dispatch(updateFileSourceInputStatusMessage(""));
        }, 4500);
      }
    }
  };
}
