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

export function uploadFile(formData) {
  return fetchWithCSRFToken("/api/v1/files/", {
    body: formData,
    method: "POST"
  });
}

export function updateFile(fileID, formData) {
  return fetchWithCSRFToken(`/api/v1/files/${fileID}/`, {
    method: "PUT",
    body: formData
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

export function saveFileToServer(
  notebookID,
  data,
  fileName,
  fileID = undefined
) {
  const formData = makeFormData(notebookID, data, fileName);
  const fetchRequest = fileID // if fileID undefined, upload, otherwise update
    ? fd => updateFile(fileID, fd)
    : fd => uploadFile(fd);
  return fetchRequest(formData).then(r => {
    if (r.status === 500) throw new Error(r.statusText);
    return r.json();
  });
}

export function deleteFileOnServer(fileID) {
  return fetchWithCSRFTokenAndJSONContent(`/api/v1/files/${fileID}/`, {
    method: "DELETE"
  }).then(r => {
    if (r.status === 500) throw new Error(r.statusText);
    return undefined;
  });
}
