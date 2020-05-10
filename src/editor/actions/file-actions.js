import {
  deleteFileOnServer,
  getFilesForNotebookFromServer,
  makeFormData,
  uploadFile
} from "../../shared/utils/file-operations";
import {
  getNotebookID,
  fileExists,
  getFiles,
  getFileID,
  isLoggedIn,
  validateFileExistence,
  validateFileAbsence
} from "../tools/server-tools";
import {
  postFileOperationErrorMessage,
  postFileOperationSuccessMessage
} from "./file-request-callbacks";

export function fileOperationError(filename, errorMessage, options = {}) {
  if (options.fileRequestID) {
    // option was requested by eval frame, don't persist errors to store
    postFileOperationErrorMessage(options.fileRequestID, errorMessage);
    return { type: "NOOP" };
  }
  return {
    type: "UPDATE_FILE",
    errorMessage,
    filename,
    status: "error"
  };
}

export function updateFiles() {
  return async (dispatch, getState) => {
    const notebookID = getNotebookID(getState());
    if (notebookID) {
      const loggedIn = isLoggedIn(getState());
      const files = await getFilesForNotebookFromServer(notebookID, loggedIn);
      dispatch({
        type: "UPDATE_FILES_FROM_SERVER",
        serverFiles: files.map(file => ({
          id: file.id,
          filename: file.filename,
          lastUpdated: file.last_updated,
          status: "saved"
        }))
      });
    }
  };
}

export function saveFile(formData, options = {}) {
  return async (dispatch, getState) => {
    const state = getState();
    const file = formData.get("file");

    const { username: notebookOwner } = state.notebookInfo;
    const { name: thisUser } = state.userData;

    if (notebookOwner !== thisUser) {
      dispatch(
        fileOperationError(
          file.name,
          "Only the owner of this notebook can save files",
          options
        )
      );
      return;
    }

    if (!options.overwrite && fileExists(file.name, state)) {
      try {
        validateFileAbsence(file.name, "save", getState());
      } catch (err) {
        dispatch(fileOperationError(file.name, err.message, options));
        return;
      }
    }
    try {
      const fileID = getFileID(state, file.name);
      const response = await uploadFile(formData, fileID);
      const { filename, id } = response;
      const lastUpdated = response.last_updated;
      dispatch({
        type: "UPDATE_FILE",
        filename,
        lastUpdated,
        fileID: id,
        status: "saved"
      });
      if (options.fileRequestID) {
        postFileOperationSuccessMessage(options.fileRequestID, undefined);
      }
    } catch (err) {
      dispatch(fileOperationError(file.name, err.message, options));
    }
  };
}

export function addTemporaryFile(filename, content, mimeType) {
  return {
    type: "SAVE_TEMPORARY_FILE",
    filename,
    content,
    mimeType
  };
}

export function deleteFile(filename, options = {}) {
  return async (dispatch, getState) => {
    try {
      validateFileExistence(filename, "delete", getState());
      const fileID = getFileID(getState(), filename);
      await deleteFileOnServer(fileID);
      dispatch({
        type: "UPDATE_FILE",
        filename,
        status: "deleted"
      });

      if (options.fileRequestID) {
        postFileOperationSuccessMessage(options.fileRequestID);
      }
    } catch (err) {
      dispatch(fileOperationError(filename, err.message, options));
    }
  };
}

export function uploadAllTemporaryFiles() {
  return async (dispatch, getState) => {
    const state = getState();
    const temporaryFiles = getFiles(state).filter(
      file => file.status === "local"
    );
    temporaryFiles.forEach(async temporaryFile => {
      const file = new File(
        [Uint8Array.from(atob(temporaryFile.content), c => c.charCodeAt(0))],
        temporaryFile.filename,
        { type: temporaryFile.mimeType }
      );
      const formData = makeFormData(
        getNotebookID(state),
        file,
        file.name,
        true
      );
      const response = await uploadFile(formData, temporaryFile.id);
      const { filename, id } = response;
      const lastUpdated = response.last_updated;
      dispatch({
        type: "UPDATE_FILE",
        filename,
        lastUpdated,
        fileID: id,
        status: "saved"
      });
    });
  };
}
