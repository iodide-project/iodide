import React from 'react'
import Modal from './modal'
import ModalTitle from './modal-title'
import ModalContent from './modal-content'
import ModalCall from './modal-call'
import { TextButton } from './buttons'
import { fetchWithCSRFTokenAndJSONContent } from '../../shared/fetch-with-csrf-token'

// delete this file
// upload this file.

function deleteFile(fileID) {
  return fetchWithCSRFTokenAndJSONContent(`/api/v1/files/${fileID}`, { method: 'DELETE' })
}

export default class UploadModal extends React.Component {
  constructor(props) {
    super(props)
    this.deleteAndReuploadFile = this.deleteAndReuploadFile.bind(this)
  }

  deleteAndReuploadFile() {
    deleteFile(this.props.oldFile.id)
      .then(() => {
        this.props.onClose();
        this.props.onUpload();
      }).catch((err) => {
        console.error(err)
      })
  }

  render() {
    return (
      <Modal visible={this.props.visible} onClose={this.props.onClose}>
        <ModalTitle>{`replace notebook file  "${(this.props.oldFile && this.props.oldFile.filename) || ''}"?`}</ModalTitle>
        <ModalContent>This action will replace the file associated
          with this notebook, and cannot be undone.
          Any other files with the same name associated
          with other notebooks will not be affected.
        </ModalContent>
        <ModalCall>
          <TextButton onClick={this.props.onCancel || this.props.onClose}>cancel
          </TextButton>
          <TextButton onClick={this.deleteAndReuploadFile}>replace file
          </TextButton>
        </ModalCall>
      </Modal>
    )
  }
}
