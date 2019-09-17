import {
  signedAPIRequest,
  signedAPIRequestWithJSONContent
} from "./api-request";

export function createFileRequest(formData) {
  return signedAPIRequest("/api/v1/files/", {
    body: formData,
    method: "POST"
  });
}

export function updateFileRequest(fileID, formData) {
  return signedAPIRequest(`/api/v1/files/${fileID}/`, {
    method: "PUT",
    body: formData
  });
}

export function deleteFileRequest(fileID) {
  return signedAPIRequestWithJSONContent(
    `/api/v1/files/${fileID}/`,
    {
      method: "DELETE"
    },
    false
  );
}

export function getFilesRequest(notebookID) {
  return signedAPIRequest(`/api/v1/notebooks/${notebookID}/files/`);
}
