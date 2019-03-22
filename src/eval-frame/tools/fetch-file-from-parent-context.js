import messagePasserEval from "../../redux-to-port-message-passer";

const FETCH_RESOLVERS = {};

function addResolvers(path, resolve, reject) {
  FETCH_RESOLVERS[path] = { resolve, reject };
}

function getResolvers(path) {
  return FETCH_RESOLVERS[path];
}

function deleteResolvers(path) {
  delete FETCH_RESOLVERS[path];
}

export function onParentContextFileFetchSuccess(file, path) {
  getResolvers(path).resolve(file);
  deleteResolvers(path);
}

export function onParentContextFileFetchError(reason, path) {
  getResolvers(path).reject(new Error(reason));
  deleteResolvers(path);
}

export default async function fetchFileFromParentContext(path, fetchType) {
  // used in eval frame.
  return new Promise((resolve, reject) => {
    // resolve and reject are handled in port-to-editor.js when
    // the file is received by the editor.
    console.log(path, fetchType);
    addResolvers(path, resolve, reject);
    messagePasserEval.postMessage("REQUEST_FETCH", { path, fetchType });
  });
}
