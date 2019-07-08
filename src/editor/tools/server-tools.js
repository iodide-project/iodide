import { FETCH_CHUNK_TYPES } from "../state-schemas/state-schema";

class IodideAPIFileDoesNotExistError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IodideAPIFileDoesNotExistError);
    }

    this.name = "IodideAPIFileDoesNotExistError";
    const [operation, fileName] = params;
    this.message = `(${operation}) file "${fileName}" does not exist`;
  }
}

class IodideAPIFileAlreadyExistsError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IodideAPIFileAlreadyExistsError);
    }

    this.name = "IodideAPIFileAlreadyExistsError";
    const [operation, fileName] = params;
    this.message = `(${operation}) file "${fileName}" already exists`;
  }
}

class InvalidFetchChunkError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidFetchChunkError);
    }

    this.name = "InvalidFetchChunkError";
    const [fetchType] = params;
    this.message = `invalid fetch type "${fetchType}"`;
  }
}

export function getUserDataFromDocument() {
  const userData = document.getElementById("userData");
  if (userData) {
    return { userData: JSON.parse(userData.textContent) };
  }
  return {};
}

export function getNotebookInfoFromDocument() {
  const notebookInfo = document.getElementById("notebookInfo");
  if (notebookInfo) {
    return { notebookInfo: JSON.parse(notebookInfo.textContent) };
  }
  return {};
}

export function getConnectionMode(state) {
  if (!("connectionMode" in state.notebookInfo))
    throw Error("state does not have connectionMode");
  return state.notebookInfo.connectionMode;
}

export function connectionModeIsStandalone(state) {
  return getConnectionMode(state) === "STANDALONE";
}

export function connectionModeIsServer(state) {
  return getConnectionMode(state) === "SERVER";
}

export function notebookIsATrial(state) {
  return state.notebookInfo.tryItMode;
}

function getId(state, idKey) {
  if (!connectionModeIsServer(state)) return undefined;
  const value = state.notebookInfo[idKey];
  if (!Number.isSafeInteger(value) && value !== undefined)
    throw Error(`${idKey} must be undefined or an integer`);
  return value;
}

export function isLoggedIn(state) {
  return !!(state.userData && state.userData.name);
}

export function getNotebookID(state) {
  return getId(state, "notebook_id");
}

export function getRevisionID(state) {
  return getId(state, "revision_id");
}

export function getFiles(state) {
  return state.notebookInfo.files;
}

export function fileExists(fileName, state) {
  const files = getFiles(state);
  return files.map(f => f.filename).includes(fileName);
}

export function getFileID(state, fileName) {
  const files = getFiles(state);
  const file = files.filter(f => f.filename === fileName)[0];
  if (file) return file.id;
  return undefined;
}

export function validateFileExistence(fileName, operation, state) {
  if (!fileExists(fileName, state)) {
    throw new IodideAPIFileDoesNotExistError(operation, fileName);
  }
}

export function validateFileAbsence(fileName, operation, state) {
  if (fileExists(fileName, state)) {
    throw new IodideAPIFileAlreadyExistsError(operation, fileName);
  }
}

export function validateFetchType(fetchType) {
  if (!FETCH_CHUNK_TYPES.includes(fetchType)) {
    throw new InvalidFetchChunkError(fetchType);
  }
}
