import {
  deleteFileSourceRequest,
  updateFileSourceRequest,
  createFileSourceRequest
} from "../server-api/file-source";

function createFileSourceRequestPayload(notebookID, method = "POST", options) {
  const postRequestOptions = {
    body: JSON.stringify({
      notebookID,
      ...options
    }),
    method
  };

  return postRequestOptions;
}

export async function saveFileSourceToServer(
  notebookID,
  sourceURL,
  destinationFilename,
  fileSourceID = undefined,
  frequency
) {
  const body = createFileSourceRequestPayload(fileSourceID ? "PUT" : "POST", {
    notebookID,
    frequency,
    sourceURL,
    destinationFilename
  });
  const r = await (fileSourceID
    ? updateFileSourceRequest(body)
    : createFileSourceRequest(body));
  return r;
}

export async function deleteFileSourceToServer(fileSourceID) {
  return deleteFileSourceRequest(fileSourceID);
}
