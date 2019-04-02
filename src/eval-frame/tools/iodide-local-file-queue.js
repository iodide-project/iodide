import generateRandomId from "../../shared/utils/generate-random-id";
import messagePasserEval from "../../shared/utils/redux-to-port-message-passer";

const fileRequestQueue = {};

function sendRequestToEditor(path, fileRequestID, requestType, metadata) {
  messagePasserEval.postMessage("FILE_REQUEST", {
    path,
    requestType,
    fileRequestID,
    metadata
  });
}

export function makeFileRequestInEditor(
  path,
  requestType,
  fileRequestPreparer
  //   path,
  //   requestType,
  //   metadata,
  //   canMakeRequest = () => {}
) {
  const fileRequestID = generateRandomId();
  if (!(path in fileRequestQueue)) {
    console.log("adding fileRequestQueue for ", path);
    fileRequestQueue[path] = { requests: {}, queue: Promise.resolve() };
  }
  const nextRequest = () =>
    new Promise((resolve, reject) => {
      console.log("starting", path, requestType, fileRequestID);
      // canMakeRequest();
      let metadata;
      try {
        metadata = fileRequestPreparer();
      } catch (err) {
        console.log("rejecting", path, fileRequestID);
        reject(err);
      }

      fileRequestQueue[path].requests[fileRequestID] = { resolve, reject };
      sendRequestToEditor(path, fileRequestID, requestType, metadata);
    })
      .catch(err => {
        throw Error(err);
      })
      .then(() => {
        console.log("finished", path, requestType, fileRequestID);
      });
  console.log("adding to queue", path, requestType, fileRequestID);
  fileRequestQueue[path].queue = fileRequestQueue[path].queue.then(nextRequest);
  return fileRequestQueue[path].queue;
}

export function onParentContextFileRequestSuccess(file, path, fileRequestID) {
  fileRequestQueue[path].requests[fileRequestID].resolve(file);
  delete fileRequestQueue[path].requests[fileRequestID];
}

export function onParentContextFileRequestError(reason, path, fileRequestID) {
  fileRequestQueue[path].requests[fileRequestID].reject(reason);
  delete fileRequestQueue[path].requests[fileRequestID];
}
