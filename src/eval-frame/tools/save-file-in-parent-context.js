import { postMessageToEditor } from "../port-to-editor";

const SAVE_FILE_RESOLVERS = {};

function addResolvers(path, resolve, reject) {
  SAVE_FILE_RESOLVERS[path] = { resolve, reject };
}

function getResolvers(path) {
  return SAVE_FILE_RESOLVERS[path];
}

function deleteResolvers(path) {
  delete SAVE_FILE_RESOLVERS[path];
}

export function onParentContextFileSaveSuccess(path) {
  getResolvers(path).resolve();
  deleteResolvers(path);
}

export function onParentContextFileSaveError(reason, path) {
  getResolvers(path).reject(new Error(reason));
  deleteResolvers(path);
}

export default async function saveFileInParentContext(notebookID, data, path) {
  // used in eval frame.
  return new Promise((resolve, reject) => {
    // resolve and reject are handled in port-to-editor.js when
    // the file is received by the editor.
    addResolvers(path, resolve, reject);
    postMessageToEditor("SAVE_FILE", { notebookID, path, data });
  });
}
