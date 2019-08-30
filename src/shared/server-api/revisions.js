import { readJSONAPIRequest } from "./api-request";

export function getRevisionList(notebookId, loggedIn) {
  return readJSONAPIRequest(
    `/api/v1/notebooks/${notebookId}/revisions/`,
    loggedIn
  );
}

export function getRevisions(notebookId, revisionIdsNeeded, loggedIn) {
  const revisionParams = revisionIdsNeeded
    .map(revisionId => `id=${revisionId}`)
    .join("&");
  return readJSONAPIRequest(
    `/api/v1/notebooks/${notebookId}/revisions/?full=1&${revisionParams}`,
    loggedIn
  );
}
