import { genericFetch } from "../utils/fetch-tools";
import {
  deleteFileRequest,
  updateFileRequest,
  createFileRequest
} from "../server-api/file";

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
  return fileID // if fileID undefined, upload, otherwise update
    ? updateFileRequest(fileID, formData)
    : createFileRequest(formData);
}

export function selectAndUploadFile(notebookID, successCallback = () => {}) {
  const filePicker = document.createElement("input");
  filePicker.type = "file";
  filePicker.id = "file-picker";
  filePicker.name = "files[]";
  filePicker.click();
  filePicker.addEventListener("change", async evt => {
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
    const output = createFileRequest(formData);
    successCallback(output);
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
  return r;
}

export function deleteFileOnServer(fileID) {
  return deleteFileRequest(fileID);
}
