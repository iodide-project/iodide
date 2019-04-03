import generateRandomId from "../../shared/utils/generate-random-id";
import messagePasserEval from "../../shared/utils/redux-to-port-message-passer";

export const fileRequests = {};

export default function sendFileRequestToEditor(
  fileName,
  requestType,
  metadata
) {
  const fileRequestID = generateRandomId();
  return {
    fileRequestID,
    request: new Promise((resolve, reject) => {
      fileRequests[fileRequestID] = { resolve, reject };
      messagePasserEval.postMessage("FILE_REQUEST", {
        fileName,
        requestType,
        fileRequestID,
        metadata
      });
    }).catch(err => {
      return err;
    })
  };
}

export function onParentContextFileRequestSuccess(
  responseOrFile,
  fileRequestID
) {
  fileRequests[fileRequestID].resolve(responseOrFile);
  delete fileRequests[fileRequestID];
}

export function onParentContextFileRequestError(reason, fileRequestID) {
  fileRequests[fileRequestID].reject(reason);
  delete fileRequests[fileRequestID];
}
