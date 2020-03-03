import {
  loadFileFromServer,
  makeFormData
} from "../../shared/utils/file-operations";
import {
  getNotebookID,
  validateFileExistence,
  validateFetchType
} from "../tools/server-tools";
import { saveFile, deleteFile } from "./file-actions";

import {
  postFileOperationErrorMessage,
  postFileOperationSuccessMessage
} from "./file-request-callbacks";

export function saveFileRequest(fileName, fileRequestID, data, overwrite) {
  return (dispatch, getState) => {
    const notebookID = getNotebookID(getState());
    const formData = makeFormData(notebookID, data, fileName);
    return dispatch(saveFile(formData, { fileRequestID, overwrite }));
  };
}

export function loadFileRequest(fileName, fileRequestID, fetchType) {
  return async (_, getState) => {
    try {
      validateFileExistence(fileName, "load", getState());
      validateFetchType(fetchType);
      const file = await loadFileFromServer(fileName, fetchType);
      postFileOperationSuccessMessage(fileRequestID, file);
      return undefined;
    } catch (err) {
      postFileOperationErrorMessage(fileRequestID, err);
      return undefined;
    }
  };
}

export function handleFileRequest(
  requestType,
  fileName,
  fileRequestID,
  options
) {
  return dispatch => {
    switch (requestType) {
      case "LOAD_FILE": {
        const { fetchType } = options;
        dispatch(loadFileRequest(fileName, fileRequestID, fetchType, true));
        break;
      }
      case "SAVE_FILE": {
        const { data, overwrite } = options;
        dispatch(
          saveFileRequest(fileName, fileRequestID, data, overwrite, true)
        );
        break;
      }
      case "DELETE_FILE": {
        dispatch(deleteFile(fileName, { fileRequestID }));
        break;
      }
      default: {
        postFileOperationErrorMessage(
          fileRequestID,
          Error(
            `an unknown request type got through the validation: ${requestType}`
          )
        );
      }
    }
  };
}
