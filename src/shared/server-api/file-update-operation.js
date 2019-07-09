import { signedAPIRequestWithJSONContent } from "./api-request";

/* 

NOTE: this API is closely concerned with the file source API in this directory.
Do not use this unless you understand how file sources work.

*/

export function createFileUpdateOperationRequest(body) {
  return signedAPIRequestWithJSONContent("/api/v1/file-update-operations/", {
    method: "POST",
    body
  });
}
