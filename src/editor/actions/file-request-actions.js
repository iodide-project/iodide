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
  validateFetchType,
  validateFileRequestType
} from "../tools/server-tools";

function messagePasserIsFunction(passer) {
  return typeof passer === "function";
}

function validateMessagePasser(passer) {
  if (!messagePasserIsFunction(passer)) {
    throw new Error("message passer must be a function");
  }
}

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

function onFileOperationSuccess(fileRequestID, messagePasser, fileOrResponse) {
  messagePasser("REQUESTED_FILE_OPERATION_SUCCESS", {
    response: fileOrResponse,
    fileRequestID
  });
}

function onFileOperationError(fileRequestID, messagePasser, err) {
  messagePasser("REQUESTED_FILE_OPERATION_ERROR", {
    fileRequestID,
    reason: err.message
  });
}

export function saveFile(fileName, fileRequestID, messagePasser, metadata) {
  validateMessagePasser(messagePasser);
  const { data, overwrite } = metadata;
  return async (dispatch, getState) => {
    const state = getState();

    const { username: notebookOwner } = state.notebookInfo;
    const { name: thisUser } = state.userData;

    if (notebookOwner !== thisUser) {
      onFileOperationError(
        fileRequestID,
        messagePasser,
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
        onFileOperationError(fileRequestID, messagePasser, err);
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
      onFileOperationSuccess(fileRequestID, messagePasser, undefined);
      return undefined;
    } catch (err) {
      onFileOperationError(fileRequestID, messagePasser, err);
      return undefined;
    }
  };
}

export function loadFile(fileName, fileRequestID, messagePasser, metadata) {
  validateMessagePasser(messagePasser);
  const { fetchType } = metadata;
  return async (_, getState) => {
    try {
      validateFileExistence(fileName, "load", getState());
      validateFetchType(fetchType);
      const file = await loadFileFromServer(`files/${fileName}`, fetchType);
      onFileOperationSuccess(fileRequestID, messagePasser, file);
      return undefined;
    } catch (err) {
      onFileOperationError(fileRequestID, messagePasser, err);
      return undefined;
    }
  };
}
export function deleteFile(fileName, fileRequestID, messagePasser) {
  return async (dispatch, getState) => {
    try {
      const fileID = getFileID(getState(), fileName);
      validateFileExistence(fileName, "delete", getState());
      validateMessagePasser(messagePasser);
      const output = await deleteFileOnServer(fileID);
      dispatch(deleteFileFromNotebook(fileID));
      onFileOperationSuccess(fileRequestID, messagePasser, output);
      return undefined;
    } catch (err) {
      onFileOperationError(fileRequestID, messagePasser, err);
      return undefined;
    }
  };
}

export function handleFileRequest(
  requestType,
  fileName,
  fileRequestID,
  metadata,
  messagePasser
) {
  try {
    validateFileRequestType(requestType);
  } catch (err) {
    onFileOperationError(fileRequestID, messagePasser, err);
  }

  return dispatch => {
    let requestAction;
    switch (requestType) {
      case "LOAD_FILE": {
        requestAction = loadFile;
        break;
      }
      case "SAVE_FILE": {
        requestAction = saveFile;
        break;
      }
      case "DELETE_FILE": {
        requestAction = deleteFile;
        break;
      }
      default: {
        console.error(
          `an unknown request type got through the validation: ${requestType}`
        );
      }
    }
    dispatch(requestAction(fileName, fileRequestID, messagePasser, metadata));
  };
}
