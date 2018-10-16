import fetchWithCSRFToken from './fetch-with-csrf-token'

export default function uploadFile(notebookID, successCallback = () => {}) {
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
