import fetchWithCSRFToken from './fetch-with-csrf-token'

export function selectFileAndFormatMetadata(notebookID) {
  return new Promise((resolve) => {
    const filePicker = document.createElement('input')
    filePicker.type = 'file'
    filePicker.id = 'file-picker'
    filePicker.name = 'files[]'
    filePicker.click();
    filePicker.addEventListener('change', (evt) => {
      const file = evt.target.files[0];
      const formData = new FormData();
      formData.append('metadata', JSON.stringify({
        filename: file.name,
        notebook_id: notebookID,
      }))
      formData.append('file', file)
      resolve(formData)
    })
  })
}

export function uploadFile(formData) {
  return fetchWithCSRFToken('/api/v1/files/', {
    body: formData,
    method: 'POST',
  })
}

export function updateFile(fileID, formData) {
  return fetchWithCSRFToken(`/api/v1/files/${fileID}/`, { method: 'PUT', body: formData })
}

export function selectAndUploadFile(notebookID, successCallback = () => {}) {
  const filePicker = document.createElement('input')
  filePicker.type = 'file'
  filePicker.id = 'file-picker'
  filePicker.name = 'files[]'
  filePicker.click();
  filePicker.addEventListener('change', (evt) => {
    const file = evt.target.files[0];
    const formData = new FormData();
    formData.append('metadata', JSON.stringify({
      filename: file.name,
      notebook_id: notebookID,
    }))
    formData.append('file', file)
    fetchWithCSRFToken('/api/v1/files/', {
      body: formData,
      method: 'POST',
    }).then(output => output.json())
      .then(output => successCallback(output))
  })
}
