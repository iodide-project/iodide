import { store as reduxStore } from "../store";
import { getFiles } from "../../editor/tools/server-tools";
import sendFileRequestToEditor from "../tools/send-file-request-to-editor";
import { FETCH_RETURN_TYPES } from "../../editor/state-schemas/state-schema";
import { addCSS, loadScriptFromBlob } from "../actions/fetch-cell-eval-actions";

const DEFAULT_SAVE_OPTIONS = { overwrite: false };

function isString(argument) {
  return typeof argument === "string" || argument instanceof String;
}

function confirmIsString(key, argument) {
  if (!isString(argument)) {
    throw new Error(
      `${key} name must be a string, instead received ${typeof argument}`
    );
  }
}

function confirmIsStringOrUndefined(key, argument) {
  if (!isString(argument) && argument !== undefined) {
    throw new Error(`
    ${key} name must be a string or undefined, instead received ${typeof argument}`);
  }
}

export function connectExists(store) {
  return function exists(fileName) {
    try {
      confirmIsString("fileName", fileName);
    } catch (err) {
      throw err;
    }
    const files = getFiles(store.getState());
    return files.map(f => f.filename).includes(fileName);
  };
}

export function connectList(store) {
  return function list() {
    return getFiles(store.getState()).map(f => f.filename);
  };
}

export function connectLastUpdated(store) {
  return function lastUpdated(fileName) {
    try {
      confirmIsString("fileName", fileName);
    } catch (err) {
      throw err;
    }
    const files = getFiles(store.getState());
    const thisFile = files.filter(f => f.filename === fileName);
    if (!thisFile.length) throw Error(`fileName ${fileName} does not exist`);
    return new Date(thisFile[0].lastUpdated);
  };
}

export function handleResourceLoad(fetchType, variableName) {
  return file => {
    if (FETCH_RETURN_TYPES.includes(fetchType) && variableName) {
      window[variableName] = file;
    } else if (fetchType === "css") {
      return addCSS(file);
    } else if (fetchType === "js") {
      return loadScriptFromBlob(file);
    }
    return file;
  };
}

export function loadFile(fileName, fetchType, variableName = undefined) {
  try {
    confirmIsString("fileName", fileName);
    confirmIsString("fetchType", fetchType);
    confirmIsStringOrUndefined("variableName", variableName);
  } catch (err) {
    throw err;
  }
  return sendFileRequestToEditor(fileName, "LOAD_FILE", {
    fetchType
  }).request.then(handleResourceLoad(fetchType, variableName));
}

export function deleteFile(fileName) {
  try {
    confirmIsString("fileName", fileName);
  } catch (err) {
    throw err;
  }
  return sendFileRequestToEditor(fileName, "DELETE_FILE").request;
}

export function saveFile(data, fileName, saveOptions = DEFAULT_SAVE_OPTIONS) {
  try {
    confirmIsString("fileName", fileName);
  } catch (err) {
    throw err;
  }
  return sendFileRequestToEditor(fileName, "SAVE_FILE", {
    ...saveOptions,
    data
  }).request;
}

export const file = {
  save: saveFile,
  load: loadFile,
  delete: deleteFile,
  exists: connectExists(reduxStore),
  list: connectList(reduxStore),
  lastUpdated: connectLastUpdated(reduxStore)
};
