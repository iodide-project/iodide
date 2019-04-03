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

function onFileOperationSuccess(fileRequestID, messagePasser) {
  return fileOrResponse => {
    messagePasser("REQUESTED_FILE_OPERATION_SUCCESS", {
      response: fileOrResponse,
      fileRequestID
    });
  };
}

function onFileOperationError(fileRequestID, messagePasser) {
  return err => {
    messagePasser("REQUESTED_FILE_OPERATION_ERROR", {
      fileRequestID,
      reason: err.message
    });
  };
}

export function saveFile(fileName, fileRequestID, metadata, messagePasser) {
  const { data, overwrite } = metadata;
  return async (dispatch, getState) => {
    const state = getState();
    const notebookID = getNotebookID(state);
    const fileID = getFileID(state, fileName);
    if (!overwrite && fileExists(fileName, state)) {
      try {
        validateFileAbsence(fileName, getState());
      } catch (err) {
        onFileOperationError(fileRequestID, messagePasser)(
          new Error(err.message)
        );
        return undefined;
      }
    }
    return saveFileToServer(notebookID, data, fileName, fileID)
      .then(fileInfo => {
        const { filename, id } = fileInfo;
        const lastUpdated = fileInfo.last_updated;
        dispatch(addFileToNotebook(filename, lastUpdated, id));
        return undefined;
      })
      .then(onFileOperationSuccess(fileRequestID, messagePasser))
      .catch(onFileOperationError(fileRequestID, messagePasser));
  };
}

export function loadFile(fileName, fileRequestID, metadata, messagePasser) {
  const { fetchType } = metadata;
  return async (_, getState) => {
    // validate the load file request
    try {
      validateFileExistence(fileName, getState());
      validateFetchType(fetchType);
    } catch (err) {
      onFileOperationError(fileRequestID, messagePasser)(err);
      return undefined;
    }
    return loadFileFromServer(`files/${fileName}`, fetchType)
      .then(onFileOperationSuccess(fileRequestID, messagePasser))
      .catch(onFileOperationError(fileRequestID, messagePasser));
  };
}
export function deleteFile(fileName, fileRequestID, metadata, messagePasser) {
  return (dispatch, getState) => {
    try {
      validateFileExistence(fileName, getState());
    } catch (err) {
      onFileOperationError(fileRequestID, messagePasser)(err);
      return undefined;
    }
    const fileID = getFileID(getState(), fileName);
    // validate the delete file request
    if (fileID === undefined) {
      onFileOperationError(fileRequestID, messagePasser)(
        new Error(`file name ${fileName} does not exist`)
      );
      return undefined;
    }
    return deleteFileOnServer(fileID)
      .then(output => {
        dispatch(deleteFileFromNotebook(fileID));
        return output;
      })
      .then(onFileOperationSuccess(fileRequestID, messagePasser))
      .catch(onFileOperationError(fileRequestID, messagePasser));
  };
}
