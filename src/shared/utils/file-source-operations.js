import {
  deleteFileSourceRequest,
  updateFileSourceRequest,
  createFileSourceRequest,
  getFileSourcesRequest
} from "../server-api/file-source";

function createFileSourceRequestPayload(options) {
  const postRequestOptions = JSON.stringify({
    ...options
  });
  return postRequestOptions;
}

export async function saveFileSourceToServer(
  notebookID,
  sourceURL,
  destinationFilename,
  updateInterval = undefined,
  fileSourceID = undefined
) {
  const body = createFileSourceRequestPayload({
    notebook_id: notebookID,
    update_interval: updateInterval,
    url: sourceURL,
    filename: destinationFilename
  });
  const r = await (fileSourceID
    ? updateFileSourceRequest(body)
    : createFileSourceRequest(body));
  return r;
}

export async function deleteFileSourceFromServer(fileSourceID) {
  return deleteFileSourceRequest(fileSourceID);
}

export async function getFileSourcesFromServer(notebookID, loggedIn) {
  return getFileSourcesRequest(notebookID, loggedIn);
}
