import { genericFetch } from "../utils/fetch-tools";
import {
  deleteFileRequest,
  updateFileRequest,
  createFileRequest,
  getFilesRequest
} from "../server-api/file";

export function loadFileFromServer(path, fetchType) {
  return genericFetch(`files/${path}`, fetchType);
}

export function valueToFile(data, fileName) {
  return new File([data], fileName);
}

export function selectSingleFileAndFormatMetadata(notebookID) {
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

export function selectMultipleFilesAndFormatMetadata(notebookID) {
  return new Promise(resolve => {
    const formDataPromises = [];
    const filePicker = document.createElement("input");
    filePicker.type = "file";
    filePicker.id = "file-picker";
    filePicker.name = "files[]";
    filePicker.multiple = "multiple";
    filePicker.click();
    filePicker.addEventListener("change", evt => {
      Array.from(evt.target.files).forEach(file => {
        formDataPromises.push(
          new Promise(formDataResolve => {
            const formData = new FormData();
            formData.append(
              "metadata",
              JSON.stringify({
                filename: file.name,
                notebook_id: notebookID
              })
            );
            formData.append("file", file);
            formDataResolve(formData);
          })
        );
      });
      Promise.all(formDataPromises).then(resolve);
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

export function makeFormData(
  notebookID,
  data,
  fileName,
  dataIsAlreadyFile = false
) {
  let file;
  if (!dataIsAlreadyFile) {
    file = valueToFile(data, fileName);
  } else {
    file = data;
  }

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
  fileID = undefined,
  dataIsAlreadyFile = false
) {
  const formData = makeFormData(notebookID, data, fileName, dataIsAlreadyFile);
  const r = await uploadFile(formData, fileID);
  return r;
}

export function deleteFileOnServer(fileID) {
  return deleteFileRequest(fileID);
}

export function getFilesForNotebookFromServer(notebookID) {
  return getFilesRequest(notebookID);
}
