import React from 'react'
import Modal from '../../shared/components/modal'
import ModalTitle from '../../shared/components/modal-title'
import ModalContent from '../../shared/components/modal-content'
import ModalCall from '../../shared/components/modal-call'
import { TextButton } from '../../shared/components/buttons'
import { fetchWithCSRFTokenAndJSONContent } from '../../shared/fetch-with-csrf-token'


export default class DeleteModal extends React.Component {
  constructor(props) {
    super(props)
    this.deleteObject = this.deleteObject.bind(this)
  }

  deleteObject() {
    fetchWithCSRFTokenAndJSONContent(this.props.url, { method: 'DELETE' })
      .then(() => {
        this.props.onClose();
        this.props.onDelete(this.props.elementID);
      }).catch((err) => {
        console.error(err)
      })
  }

  render() {
    return (
      <Modal visible={this.props.visible} onClose={this.props.onClose}>
        <ModalTitle>{this.props.title}</ModalTitle>
        <ModalContent>{this.props.content || 'This action cannot be undone.'}</ModalContent>
        <ModalCall>
          <TextButton onClick={this.props.onCancel || this.props.onClose}>Cancel
          </TextButton>
          <TextButton onClick={this.deleteObject}>Delete
          </TextButton>
        </ModalCall>
      </Modal>
    )
  }
}
