import { store as reduxStore } from "../store";
import fetchFileFromParentContext from "../tools/fetch-file-from-parent-context";
import saveFileInParentContext from "../tools/save-file-in-parent-context";

const VARIABLE_TYPE_FILES = ["text", "json", "blob"];

// custom file saving functionality, needs to work like fetchFromParentContext or whatever?

export function connectLoad(fetchFunction) {
  return async function load(fileName, fileType, variableName = undefined) {
    return fetchFunction(`files/${fileName}`, fileType).then(file => {
      if (VARIABLE_TYPE_FILES.includes(fileType) && variableName) {
        window[variableName] = file;
      }
      // set window, if applicable
      return file;
    });
  };
}

export function deleteFile() {}

export function connectExists(store) {
  return function exists(fileName) {
    if (!(typeof fileName === "string" || fileName instanceof String)) {
      throw new Error(
        `fileName must be a string, instead received ${typeof fileName}`
      );
    }
    const { files } = store.getState().notebookInfo;
    return files.map(f => f.filename).includes(fileName);
  };
}

export function connectList(store) {
  return function list() {
    return store.getState().notebookInfo.files.map(f => f.filename);
  };
}

export function connectSave(store, saveFunction) {
  return function save(data, fileName, saveOptions = { overwrite: true }) {
    // first thing first = check to see if exists in store.
    const exists = connectExists(store);
    if (!saveOptions.overwrite && exists(fileName)) {
      throw new Error("cannot overwrite this file ughhhh!!!!!!");
    }
    return saveFunction(
      store.getState().notebookInfo.notebook_id,
      data,
      fileName
    );
  };
}

export const file = {
  save: connectSave(reduxStore, saveFileInParentContext),
  load: connectLoad(fetchFileFromParentContext),
  delete: deleteFile,
  exists: connectExists(reduxStore),
  list: connectList(reduxStore)
};
