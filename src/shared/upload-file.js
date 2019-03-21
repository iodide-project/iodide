import fetchWithCSRFToken from "./fetch-with-csrf-token";

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

export function valueToFile(data, fileName) {
  return new File([data], fileName);
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

export function uploadFile(formData) {
  return fetchWithCSRFToken("/api/v1/files/", {
    method: "POST",
    body: formData
  });
}

export function updateFile(fileID, formData) {
  return fetchWithCSRFToken(`/api/v1/files/${fileID}/`, {
    method: "PUT",
    body: formData
  });
}

export function saveFileToServer(
  notebookID,
  data,
  fileName,
  updateFileFlag = false,
  fileID = undefined
) {
  const formData = makeFormData(notebookID, data, fileName);
  const fetchRequest = updateFileFlag
    ? fd => updateFile(fileID, fd)
    : fd => uploadFile(fd);
  return fetchRequest(formData);
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
