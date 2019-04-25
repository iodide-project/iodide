import { getState as reduxStoreGetState } from "../../store";
import { getFiles } from "../../../editor/tools/server-tools";
import sendFileRequestToEditor from "../../tools/send-file-request-to-editor";
import IodideAPIError from "./iodide-api-error";
import fileSerializers from "./file-serializers";
import { IODIDE_API_LOAD_TYPES } from "../../../editor/state-schemas/state-schema";

const DEFAULT_SAVE_OPTIONS = { overwrite: false };

function isString(argument) {
  return typeof argument === "string" || argument instanceof String;
}

function confirmIsSerializer(serializationType) {
  if (!Object.keys(fileSerializers).includes(serializationType)) {
    throw new IodideAPIError(
      `serialization type ${serializationType} not recognized`
    );
  }
}

function confirmIsString(key, argument) {
  if (!isString(argument)) {
    throw new IodideAPIError(
      `${key} name must be a string, instead received ${typeof argument}`
    );
  }
}

function confirmIsStringOrUndefined(key, argument) {
  if (!isString(argument) && argument !== undefined) {
    throw new IodideAPIError(`
${key} name must be a string or undefined, instead received ${typeof argument}`);
  }
}

function confirmFetchTypeIsValid(fetchType) {
  if (!IODIDE_API_LOAD_TYPES.includes(fetchType)) {
    throw new IodideAPIError(`${fetchType} not a returnable fetch type`);
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
    if (!thisFile.length)
      throw new IodideAPIError(`fileName ${fileName} does not exist`);
    return new Date(thisFile[0].lastUpdated);
  };
}

export async function loadFile(fileName, fetchType, variableName = undefined) {
  confirmIsString("fileName", fileName);
  confirmIsString("fetchType", fetchType);
  confirmIsStringOrUndefined("variableName", variableName);
  confirmFetchTypeIsValid(fetchType);
  const file = await sendFileRequestToEditor(fileName, "LOAD_FILE", {
    fetchType
  });
  if (variableName !== undefined) {
    window[variableName] = file;
  }
  return file;
}

export async function deleteFile(fileName) {
  confirmIsString("fileName", fileName);
  return sendFileRequestToEditor(fileName, "DELETE_FILE");
}

export async function saveFile(
  fileName,
  serializationType,
  data,
  saveOptions = DEFAULT_SAVE_OPTIONS
) {
  confirmIsString("fileName", fileName);
  confirmIsString("serializationType", serializationType);
  confirmIsSerializer(serializationType);
  const serializedData = fileSerializers[serializationType](data);
  return sendFileRequestToEditor(fileName, "SAVE_FILE", {
    ...saveOptions,
    data: serializedData,
    serializationType
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
