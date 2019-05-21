import {
  signedAPIRequestWithJSONContent,
  signedAPIRequest
} from "./api-request";

export function getNotebookRequest(notebookId) {
  return signedAPIRequest(`/api/v1/notebooks/${notebookId}/`);
}

function createNotebookRequestPayload(title, content, options) {
  const postRequestOptions = {
    body: JSON.stringify({
      title,
      content,
      ...options
    }),
    method: "POST"
  };

  return postRequestOptions;
}

export function createNotebookRequest(title, jsmd, options) {
  return signedAPIRequestWithJSONContent(
    "/api/v1/notebooks/",
    createNotebookRequestPayload(title, jsmd, options)
  );
}

export function updateNotebookRequest(
  notebookId,
  currentRevisionId,
  newTitle,
  newJsmd
) {
  return signedAPIRequestWithJSONContent(
    `/api/v1/notebooks/${notebookId}/revisions/`,
    createNotebookRequestPayload(
      newTitle,
      newJsmd,
      currentRevisionId ? { parent_revision_id: currentRevisionId } : {}
    )
  );
}

export function deleteNotebookRequest(notebookId) {
  return signedAPIRequestWithJSONContent(
    `/api/v1/notebooks/${notebookId}/`,
    {
      method: "DELETE"
    },
    false
  );
}

export function deleteNotebookRevisionRequest(notebookId, revisionId) {
  return signedAPIRequestWithJSONContent(
    `/api/v1/notebooks/${notebookId}/revisions/${revisionId}/`,
    {
      method: "DELETE"
    },
    false
  );
}
