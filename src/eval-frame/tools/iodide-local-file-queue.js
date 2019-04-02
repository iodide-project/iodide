import generateRandomId from "../../shared/utils/generate-random-id";
import messagePasserEval from "../../shared/utils/redux-to-port-message-passer";

const fileRequestQueue = {};

export function onParentContextFileRequestSuccess(
  responseOrFile,
  path,
  fileRequestID
) {
  fileRequestQueue[path].requests[fileRequestID].resolve(responseOrFile);
  delete fileRequestQueue[path].requests[fileRequestID];
}

export function onParentContextFileRequestError(reason, path, fileRequestID) {
  fileRequestQueue[path].requests[fileRequestID].reject(reason);
  // we must reset the queue for this path.
  fileRequestQueue[path].queue = Promise.resolve();
  delete fileRequestQueue[path].requests[fileRequestID];
}

function sendRequestToEditor(path, fileRequestID, requestType, metadata) {
  messagePasserEval.postMessage("FILE_REQUEST", {
    path,
    requestType,
    fileRequestID,
    metadata
  });
}

export function instantiateQueueForPath(path) {
  if (!(path in fileRequestQueue)) {
    fileRequestQueue[path] = { requests: {}, queue: Promise.resolve() };
  }
}

export function makeFileRequestInEditor(
  path,
  requestType,
  metadataArgumentsOrFunction
) {
  const fileRequestID = generateRandomId();
  instantiateQueueForPath(path);
  const nextRequest = () =>
    new Promise((resolve, reject) => {
      fileRequestQueue[path].requests[fileRequestID] = { resolve, reject };
      let metadata;
      let continueRequest = false;
      try {
        metadata =
          typeof metadataArgumentsOrFunction === "function"
            ? metadataArgumentsOrFunction()
            : metadataArgumentsOrFunction;
        continueRequest = true;
      } catch (err) {
        onParentContextFileRequestError(err, path, fileRequestID);
      }
      if (continueRequest) {
        sendRequestToEditor(path, fileRequestID, requestType, metadata);
      }
    }).catch(err => {
      throw Error(err);
    });
  fileRequestQueue[path].queue = fileRequestQueue[path].queue.then(nextRequest);
  return fileRequestQueue[path].queue;
}
