import {
  loadFileFromServer,
  saveFileToServer,
  deleteFileOnServer
} from "../../shared/utils/file-operations";
// import { postMessageToEvalFrame } from "../port-to-eval-frame";
import { getNotebookID } from "../tools/server-tools";
import { FETCH_TYPES } from "../state-schemas/state-schema";

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

function getFiles(state) {
  return state.notebookInfo.files;
}

export function exists(fileName, state) {
  const files = getFiles(state);
  return files.map(f => f.filename).includes(fileName);
}

function fileDoesNotExistMessage(operation, fileName) {
  return `${operation}: file "${fileName}" does not exist`;
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

function validateFileExistence(fileName, state) {
  if (!exists(fileName, state)) {
    throw new Error(fileDoesNotExistMessage("load", fileName));
  }
}

function validateFetchType(fetchType) {
  if (!FETCH_TYPES.includes(fetchType)) {
    throw new Error(`invalid fetch type "${fetchType}"`);
  }
}

function getFileID(state, fileName) {
  const files = getFiles(state);
  const file = files.filter(f => f.filename === fileName)[0];
  if (file) return file.id;
  return undefined;
}

export function saveFile(message, messagePasser) {
  const { fileName, fileRequestID } = message;
  const { data, overwrite } = message.metadata;
  return async (dispatch, getState) => {
    const state = getState();
    const notebookID = getNotebookID(state);
    const fileID = getFileID(state, fileName);
    if (!overwrite && exists(fileName, state)) {
      validateFileExistence(fileName, getState());
    }
    return saveFileToServer(notebookID, data, fileName, fileID)
      .then(fileInfo => {
        const { filename, lastUpdated, id } = fileInfo;
        dispatch(addFileToNotebook(filename, lastUpdated, id));
        return undefined;
      })
      .then(onFileOperationSuccess(fileRequestID, messagePasser))
      .catch(onFileOperationError(fileRequestID, messagePasser));
  };
}

export function loadFile(message, messagePasser) {
  const { fileName, fileRequestID } = message;
  const { fetchType } = message.metadata;
  return async (_, getState) => {
    try {
      validateFileExistence(fileName, getState());
      validateFetchType(fetchType);
    } catch (err) {
      onFileOperationError(fileRequestID, fileName)(new Error(err.message));
      return undefined;
    }
    return loadFileFromServer(`files/${fileName}`, fetchType)
      .then(onFileOperationSuccess(fileRequestID, messagePasser))
      .catch(onFileOperationError(fileRequestID, messagePasser));
  };
}
export function deleteFile(message, messagePasser) {
  const { fileName, fileRequestID } = message;
  return (dispatch, getState) => {
    const fileID = getFileID(getState(), fileName);
    if (fileID === undefined) {
      onFileOperationError(fileRequestID, fileName)(
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
