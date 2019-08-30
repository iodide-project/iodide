import {
  createFileUpdateOperationRequest,
  getFileUpdateOperationRequest
} from "../server-api/file-update-operation";

/* 

I dare you to find a better outcome to a naming convention than this file.

*/
function createFileUpdateOperationPayload(options) {
  const postRequestOptions = JSON.stringify({
    ...options
  });
  return postRequestOptions;
}

export async function saveFileUpdateOperationToServer(fileSourceID) {
  const body = createFileUpdateOperationPayload({
    file_source_id: fileSourceID
  });
  const r = await createFileUpdateOperationRequest(body);
  return r;
}

export async function getFileUpdateOperationFromServer(fileUpdateOperationID) {
  const r = await getFileUpdateOperationRequest(fileUpdateOperationID);
  return r;
}
