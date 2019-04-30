import { genericFetch } from "./fetch-tools";
import fetchWithCSRFToken, {
  fetchWithCSRFTokenAndJSONContent
} from "../fetch-with-csrf-token";

export function loadFileFromServer(path, fetchType) {
  return genericFetch(path, fetchType);
}

export function valueToFile(data, fileName) {
  return new File([data], fileName);
}

export function selectFileAndFormatMetadata(notebookID) {
  return new Promise(resolve => {
    const filePicker = document.createElement("input");
    filePicker.type = "file";
    filePicker.id = "file-picker";
    filePicker.name = "files[]";
    filePicker.click();
    filePicker.addEventListener("change", evt => {
      const file = evt.target.files[0];
      const formData = new FormData();
      formData.append(
        "metadata",
        JSON.stringify({
          filename: file.name,
          notebook_id: notebookID
        })
      );
      formData.append("file", file);
      resolve(formData);
    });
  });
}

export function uploadFile(formData, fileID = undefined) {
  // if fileID not defined, this will upload the file, or return an error if
  // the filename in formData is already in the files table.
  // if fileID is provided, will attempt to update the entry in the files table.
  const url = fileID ? `/api/v1/files/${fileID}/` : `/api/v1/files/`;
  const method = fileID ? "PUT" : "POST";
  return fetchWithCSRFToken(url, {
    body: formData,
    method
  });
}

export function selectAndUploadFile(notebookID, successCallback = () => {}) {
  const filePicker = document.createElement("input");
  filePicker.type = "file";
  filePicker.id = "file-picker";
  filePicker.name = "files[]";
  filePicker.click();
  filePicker.addEventListener("change", evt => {
    const file = evt.target.files[0];
    const formData = new FormData();
    formData.append(
      "metadata",
      JSON.stringify({
        filename: file.name,
        notebook_id: notebookID
      })
    );
    formData.append("file", file);
    fetchWithCSRFToken("/api/v1/files/", {
      body: formData,
      method: "POST"
    })
      .then(output => output.json())
      .then(output => successCallback(output));
  });
}

export function makeFormData(notebookID, data, fileName) {
  const file = valueToFile(data, fileName);
  const formData = new FormData();
  formData.append(
    "metadata",
    JSON.stringify({
      filename: file.name,
      notebook_id: notebookID
    })
  );
  formData.append("file", file);
  return formData;
}

export async function saveFileToServer(
  notebookID,
  data,
  fileName,
  fileID = undefined
) {
  const formData = makeFormData(notebookID, data, fileName);
  const r = await uploadFile(formData, fileID);
  if (r.status === 500) throw new Error(r.statusText);
  return r.json();
}

export function makeDeleteRequestPRIVATE(url) {
  return fetchWithCSRFTokenAndJSONContent(url, { method: "DELETE" }).then(r => {
    if (r.status === 500) throw new Error(r.statusText);
    return undefined;
  });
}

export function deleteNotebookOnServer(notebookID) {
  return makeDeleteRequestPRIVATE(`/api/v1/notebooks/${notebookID}`);
}

export function deleteRevisionOnServer(notebookID, revisionID) {
  return makeDeleteRequestPRIVATE(
    `/api/v1/notebooks/${notebookID}/revisions/${revisionID}`
  );
}

export function deleteFileOnServer(fileID) {
  return makeDeleteRequestPRIVATE(`/api/v1/files/${fileID}/`);
}
