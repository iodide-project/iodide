import generateRandomId from "../../shared/utils/generate-random-id";
import messagePasserEval from "../../shared/utils/redux-to-port-message-passer";

// NOTE: exporting this for tests.
export const fileRequestQueue = {};

export function onParentContextFileRequestSuccess(
  responseOrFile,
  path,
  fileRequestID
) {
  if (typeof path !== "string")
    throw new TypeError(
      "onParentContextFileRequestSuccess requires a string path"
    );
  if (typeof fileRequestID !== "string")
    throw new TypeError(
      "onParentContextFileRequestSuccess requires a string fileRequestID"
    );
  fileRequestQueue[path].requests[fileRequestID].resolve(responseOrFile);
  delete fileRequestQueue[path].requests[fileRequestID];
}

export function onParentContextFileRequestError(reason, path, fileRequestID) {
  fileRequestQueue[path].requests[fileRequestID].reject(reason);
  fileRequestQueue[path].queue = Promise.resolve();
  delete fileRequestQueue[path].requests[fileRequestID];
}

function sendRequestToEditor(path, fileRequestID, requestType, metadata) {
  // FIXME: add requestType metadata validator here.
  messagePasserEval.postMessage("FILE_REQUEST", {
    path,
    requestType,
    fileRequestID,
    metadata
  });
}

function instantiateQueueForPath(path) {
  if (!(path in fileRequestQueue)) {
    fileRequestQueue[path] = { requests: {}, queue: undefined };
  }
}

export default function sendFileRequestToEditor(
  path,
  requestType,
  validateAndGenerateMetadata
) {
  if (typeof path !== "string") throw new Error("path must be string");
  if (typeof requestType !== "string")
    throw new Error("requestType must be string");
  if (typeof validateAndGenerateMetadata !== "function")
    throw new Error("validateAndGenerateMetadata must be a function");

  const fileRequestID = generateRandomId();
  instantiateQueueForPath(path);

  const nextRequest = () =>
    new Promise((resolve, reject) => {
      fileRequestQueue[path].requests[fileRequestID] = { resolve, reject };
      let metadata;
      let continueRequest = false;
      try {
        metadata = validateAndGenerateMetadata();
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
  // enqueue nextRequest
  const fileRequest = fileRequestQueue[path].queue
    ? fileRequestQueue[path].queue
    : nextRequest();
  fileRequestQueue[path].queue = fileRequest;
  return fileRequest;
}
