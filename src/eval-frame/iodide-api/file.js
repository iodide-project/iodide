import { store as reduxStore } from "../store";
import { makeFileRequestInEditor } from "../tools/iodide-local-file-queue";

const VALID_FETCH_TYPES = ["text", "json", "blob", "js", "css"];
const VARIABLE_TYPE_FILES = ["text", "json", "blob"];

function fileDoesNotExistMessage(operation, fileName) {
  return `${operation}: file "${fileName}" does not exist`;
}

function getFiles(store) {
  return store.getState().notebookInfo.files;
}

export function connectExists(store) {
  return function exists(fileName) {
    const files = getFiles(store);
    if (!(typeof fileName === "string" || fileName instanceof String)) {
      throw new Error(
        `fileName must be a string, instead received ${typeof fileName}`
      );
    }
    return files.map(f => f.filename).includes(fileName);
  };
}

export function connectList(store) {
  return function list() {
    return getFiles(store);
  };
}

export function connectLoad(store, fetchFunction) {
  return async function load(fileName, fetchType, variableName = undefined) {
    const validateAndFetchMetadata = () => {
      const exists = connectExists(store)(fileName);
      if (!exists) {
        throw new Error(fileDoesNotExistMessage("load", fileName));
      }
      if (!VALID_FETCH_TYPES.includes(fetchType)) {
        throw new Error(`invalid fetch type "${fetchType}"`);
      }
      return { fetchType };
    };

    return fetchFunction(fileName, "LOAD_FILE", validateAndFetchMetadata).then(
      file => {
        if (VARIABLE_TYPE_FILES.includes(fetchType) && variableName) {
          window[variableName] = file;
        }
        return file;
      }
    );
  };
}

export function connectDeleteFile(store, deleteFunction) {
  return function deleteFile(fileName) {
    // make request in editor
    const createMetadata = () => {
      const { files } = store.getState().notebookInfo;

      const fileIDindex = files.findIndex(file => file.filename === fileName);
      if (fileIDindex === -1) {
        throw new Error(fileDoesNotExistMessage("delete", fileName));
      }
      const fileID = files[fileIDindex].id;
      return { fileID };
    };

    return deleteFunction(fileName, "DELETE_FILE", createMetadata);
  };
}

// export function downloadFile(data, filename) {}

export function connectSave(store, saveFunction) {
  return function save(data, fileName, saveOptions = { overwrite: false }) {
    // first thing first = check to see if exists in store.

    const validateAndFetchMetadata = () => {
      const exists = connectExists(store);
      if (!saveOptions.overwrite && exists(fileName)) {
        throw new Error(
          `file ${fileName} already exists. Try setting {overwrite: true}`
        );
      }

      const updateFile = saveOptions.overwrite && exists(fileName);
      const files = getFiles(store);
      const fileID = exists(fileName)
        ? files[files.findIndex(f => f.filename === fileName)].id
        : undefined;
      return {
        notebookID: store.getState().notebookInfo.notebook_id,
        data,
        updateFile, // this flag tells us if we need to update the file
        fileID // for updating the file
      };
    };

    return saveFunction(fileName, "SAVE_FILE", validateAndFetchMetadata);
  };
}

export const file = {
  save: connectSave(reduxStore, makeFileRequestInEditor),
  load: connectLoad(reduxStore, makeFileRequestInEditor),
  delete: connectDeleteFile(reduxStore, makeFileRequestInEditor),
  exists: connectExists(reduxStore),
  list: connectList(reduxStore)
};
