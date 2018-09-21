import React from 'react'
import Modal from './modal'
import ModalTitle from './modal-title'
import ModalContent from './modal-content'
import ModalCall from './modal-call'
import { TextButton } from './buttons'
import fetchWithCSRFToken from '../../shared/fetch-with-csrf-token'


export default class DeleteModal extends React.Component {
  constructor(props) {
    super(props)
    this.deleteObject = this.deleteObject.bind(this)
  }

  deleteObject() {
    fetchWithCSRFToken(this.props.url, { method: 'DELETE' })
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
          <TextButton onClick={this.props.onCancel || this.props.onClose}>cancel
          </TextButton>
          <TextButton onClick={this.deleteObject}>delete
          </TextButton>
        </ModalCall>
      </Modal>
    )
  }
}
