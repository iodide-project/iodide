import generateRandomId from "../../shared/utils/generate-random-id";
import messagePasserEval from "../../shared/utils/redux-to-port-message-passer";

export const fileRequests = {};

export default async function sendFileRequestToEditor(
  fileName,
  requestType,
  options,
  fileRequestID = generateRandomId()
) {
  messagePasserEval.postMessage("FILE_REQUEST", {
    fileName,
    requestType,
    fileRequestID,
    options
  });

  const requestResult = await new Promise((resolve, reject) => {
    fileRequests[fileRequestID] = { resolve, reject };
  });

  return requestResult;
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
