import {
  loadFileFromServer,
  saveFileToServer,
  deleteFileOnServer
} from "../../shared/utils/file-operations";
import {
  getNotebookID,
  fileExists,
  getFileID,
  validateFileExistence,
  validateFileAbsence,
  validateFetchType
} from "../tools/server-tools";

import {
  onFileOperationSuccess,
  onFileOperationError
} from "./file-request-callbacks";

export function addFileToNotebook(filename, lastUpdated, fileID) {
  return {
    type: "ADD_FILE_TO_NOTEBOOK",
    filename,
    lastUpdated,
    fileID
  };
}

export function deleteFileFromNotebook(fileID) {
  return {
    type: "DELETE_FILE_FROM_NOTEBOOK",
    fileID
  };
}

export function saveFile(fileName, fileRequestID, metadata) {
  const { data, overwrite } = metadata;
  return async (dispatch, getState) => {
    const state = getState();

    const { username: notebookOwner } = state.notebookInfo;
    const { name: thisUser } = state.userData;

    if (notebookOwner !== thisUser) {
      onFileOperationError(
        fileRequestID,
        new Error("only the owner of this notebook can save files")
      );
      return undefined;
    }

    const notebookID = getNotebookID(state);
    const fileID = getFileID(state, fileName);
    if (!overwrite && fileExists(fileName, state)) {
      try {
        validateFileAbsence(fileName, "save", getState());
      } catch (err) {
        onFileOperationError(fileRequestID, err);
        return undefined;
      }
    }
    try {
      const fileInfo = await saveFileToServer(
        notebookID,
        data,
        fileName,
        fileID
      );
      const { filename, id } = fileInfo;
      const lastUpdated = fileInfo.last_updated;
      dispatch(addFileToNotebook(filename, lastUpdated, id));
      onFileOperationSuccess(fileRequestID, undefined);
      return undefined;
    } catch (err) {
      onFileOperationError(fileRequestID, err);
      return undefined;
    }
  };
}

export function loadFile(fileName, fileRequestID, metadata) {
  const { fetchType } = metadata;
  return async (_, getState) => {
    try {
      validateFileExistence(fileName, "load", getState());
      validateFetchType(fetchType);
      const file = await loadFileFromServer(`files/${fileName}`, fetchType);
      onFileOperationSuccess(fileRequestID, file);
      return undefined;
    } catch (err) {
      onFileOperationError(fileRequestID, err);
      return undefined;
    }
  };
}
export function deleteFile(fileName, fileRequestID) {
  return async (dispatch, getState) => {
    try {
      const fileID = getFileID(getState(), fileName);
      validateFileExistence(fileName, "delete", getState());
      const output = await deleteFileOnServer(fileID);
      dispatch(deleteFileFromNotebook(fileID));
      onFileOperationSuccess(fileRequestID, output);
      return undefined;
    } catch (err) {
      onFileOperationError(fileRequestID, err);
      return undefined;
    }
  };
}

export function handleFileRequest(
  requestType,
  fileName,
  fileRequestID,
  metadata
) {
  return dispatch => {
    switch (requestType) {
      case "LOAD_FILE": {
        dispatch(loadFile(fileName, fileRequestID, metadata));
        break;
      }
      case "SAVE_FILE": {
        dispatch(saveFile(fileName, fileRequestID, metadata));
        break;
      }
      case "DELETE_FILE": {
        dispatch(deleteFile(fileName, fileRequestID, metadata));
        break;
      }
      default: {
        onFileOperationError(
          fileRequestID,
          Error(
            `an unknown request type got through the validation: ${requestType}`
          )
        );
      }
    }
  };
}
