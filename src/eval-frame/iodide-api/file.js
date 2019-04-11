import { getState as reduxStoreGetState } from "../store";
import { getFiles } from "../../editor/tools/server-tools";
import sendFileRequestToEditor from "../tools/send-file-request-to-editor";
import { FETCH_RETURN_TYPES } from "../../editor/state-schemas/state-schema";

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

function confirmFetchTypeIsReturnable(fetchType) {
  if (!FETCH_RETURN_TYPES.includes(fetchType)) {
    throw new Error(`${fetchType} not a returnable fetch type`);
  }
}

export function connectExists(getState) {
  return function exists(fileName) {
    confirmIsString("fileName", fileName);
    const files = getFiles(getState());
    return files.map(f => f.filename).includes(fileName);
  };
}

export function connectList(getState) {
  return function list() {
    return getFiles(getState()).map(f => f.filename);
  };
}

export function connectLastUpdated(getState) {
  return function lastUpdated(fileName) {
    confirmIsString("fileName", fileName);
    const files = getFiles(getState());
    const thisFile = files.filter(f => f.filename === fileName);
    if (!thisFile.length) throw Error(`fileName ${fileName} does not exist`);
    return new Date(thisFile[0].lastUpdated);
  };
}

export function handleResourceLoad(fetchType, variableName) {
  return file => {
    if (FETCH_RETURN_TYPES.includes(fetchType) && variableName) {
      window[variableName] = file;
    }
    return file;
  };
}

export function loadFile(fileName, fetchType, variableName = undefined) {
  confirmIsString("fileName", fileName);
  confirmIsString("fetchType", fetchType);
  confirmIsStringOrUndefined("variableName", variableName);
  confirmFetchTypeIsReturnable(fetchType);
  return sendFileRequestToEditor(fileName, "LOAD_FILE", {
    fetchType
  }).then(handleResourceLoad(fetchType, variableName));
}

export function deleteFile(fileName) {
  confirmIsString("fileName", fileName);
  return sendFileRequestToEditor(fileName, "DELETE_FILE");
}

export function saveFile(data, fileName, saveOptions = DEFAULT_SAVE_OPTIONS) {
  confirmIsString("fileName", fileName);
  return sendFileRequestToEditor(fileName, "SAVE_FILE", {
    ...saveOptions,
    data
  });
}

export const file = {
  save: saveFile,
  load: loadFile,
  delete: deleteFile,
  exists: connectExists(reduxStoreGetState),
  list: connectList(reduxStoreGetState),
  lastUpdated: connectLastUpdated(reduxStoreGetState)
};
