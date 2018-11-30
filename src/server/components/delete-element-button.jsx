import React from 'react'
import { OutlineButton } from '../../shared/components/buttons'
import DeleteModal from './delete-modal'

// export class WithDeleteModal extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = { visible: false }
//     this.hideModal = this.hideModal.bind(this)
//     this.showModal = this.showModal.bind(this)
//     this.deleteObject = this.deleteObject.bind(this)
//   }

//   hideModal() {
//     this.setState({ visible: false })
//   }

//   showModal() {
//     this.setState({ visible: true })
//   }

//   deleteObject() {
//     fetchWithCSRFToken(this.props.url, { method: 'DELETE' })
//       .then(() => {
//         this.hideModal()
//         this.props.onDelete(this.props.elementID);
//       }).catch((err) => {
//         console.error(err)
//       })
//   }

//   render() {
//     const children = React.Children.map(
//       this.props.children,
//       child => React.cloneElement(child, { onClick: this.showModal }),
//     )
//     return (
//       <React.Fragment>
//         {children}
//         <Modal visible={this.state.visible} onClose={this.hideModal}>
//           <ModalTitle>{this.props.modalTitle}</ModalTitle>
//           <ModalContent>{this.props.modalBody || 'This action cannot be undone.'}</ModalContent>
//           <ModalCall>
//             <TextButton onClick={this.hideModal}>cancel
//             </TextButton>
//             <TextButton onClick={this.deleteObject}>delete
//             </TextButton>
//           </ModalCall>
//         </Modal>
//       </React.Fragment>
//     )
//   }
// }


export default class DeleteObjectButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { visible: false }
    this.hideModal = this.hideModal.bind(this)
    this.showModal = this.showModal.bind(this)
  }

  hideModal() {
    this.setState({ visible: false })
  }

  showModal() {
    this.setState({ visible: true })
  }

  render() {
    return (
      <React.Fragment>
        <OutlineButton buttonHoverColor="red" buttonColor="#cc5500" onClick={this.showModal}>
          {this.props.text || 'delete'}
        </OutlineButton>
        <DeleteModal
          visible={this.state.visible}
          onClose={this.hideModal}
          title={this.props.title}
          content={this.props.modalBody}
          onCancel={this.hideModal}
          onDelete={this.props.onDelete}
          elementID={this.props.elementID}
          url={this.props.url}
        />
      </React.Fragment>
    )
  }
}
