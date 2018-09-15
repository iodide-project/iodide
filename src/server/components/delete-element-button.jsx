import React from 'react'
import { OutlineButton, TextButton } from './buttons'
import Modal from './modal'
import ModalTitle from './modal-title'
import ModalContent from './modal-content'
import ModalCall from './modal-call'


function getCookie(name) {
  if (!document.cookie) {
    return null
  }
  const token = document.cookie.split(';')
    .map(c => c.trim())
    .filter(c => c.startsWith(`${name}=`))

  if (token.length === 0) {
    return null;
  }
  return decodeURIComponent(token[0].split('=')[1])
}

export default class DeleteObjectButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { visible: false }
    this.hideModal = this.hideModal.bind(this)
    this.showModal = this.showModal.bind(this)
    this.deleteObject = this.deleteObject.bind(this)
  }

  hideModal() {
    this.setState({ visible: false })
  }

  showModal() {
    this.setState({ visible: true })
  }

  deleteObject() {
    const csrfToken = getCookie('csrftoken')
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    };
    // this.props.url ={`/api/v1/notebooks/${this.props.notebookID}/`}
    // this.props.elementID

    fetch(this.props.url, {
      method: 'DELETE',
      headers,
    }).then(() => {
      this.hideModal()
      this.props.onDelete(this.props.elementID);
    }).catch((err) => {
      console.error(err)
    })
  }

  render() {
    return (
      <React.Fragment>
        <OutlineButton buttonHoverColor="red" buttonColor="#cc5500" onClick={this.showModal}>
          {this.props.text || 'delete'}
        </OutlineButton>
        <Modal visible={this.state.visible} onClose={this.hideModal}>
          <ModalTitle>{this.props.modalTitle}</ModalTitle>
          <ModalContent>{this.props.modalBody || 'This action cannot be undone.'}</ModalContent>
          <ModalCall>
            <TextButton onClick={this.hideModal}>cancel
            </TextButton>
            <TextButton onClick={this.deleteObject}>delete
            </TextButton>
          </ModalCall>
        </Modal>
      </React.Fragment>
    )
  }
}

