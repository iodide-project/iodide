import {
  deleteFileSourceRequest,
  updateFileSourceRequest,
  createFileSourceRequest
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
  frequency = "24:00:00",
  fileSourceID = undefined
) {
  const body = createFileSourceRequestPayload({
    notebook_id: notebookID,
    update_interval: frequency,
    source: sourceURL,
    filename: destinationFilename
  });
  const r = await (fileSourceID
    ? updateFileSourceRequest(body)
    : createFileSourceRequest(body));
  return r;
}

export async function deleteFileSourceToServer(fileSourceID) {
  return deleteFileSourceRequest(fileSourceID);
}
