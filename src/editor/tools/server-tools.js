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

export function getNotebookID(state) {
  return getId(state, "notebook_id");
}

export function getRevisionID(state) {
  return getId(state, "revision_id");
}
