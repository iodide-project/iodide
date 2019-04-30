import React from "react";
import PropTypes from "prop-types";
import Modal from "../../shared/components/modal";
import ModalTitle from "../../shared/components/modal-title";
import ModalContent from "../../shared/components/modal-content";
import ModalCall from "../../shared/components/modal-call";
import { TextButton } from "../../shared/components/buttons";
import { deleteFileOnServer } from "../../shared/utils/file-operations";

export default class DeleteModal extends React.Component {
  static propTypes = {
    elementID: PropTypes.number,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
    onCancel: PropTypes.func,
    visible: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.array
    ])
  };
  constructor(props) {
    super(props);
    this.deleteObject = this.deleteObject.bind(this);
  }

  deleteObject() {
    // add delete here

    deleteFileOnServer(this.props.elementID)
      .then(() => {
        this.props.onClose();
        this.props.onDelete(this.props.elementID);
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <Modal visible={this.props.visible} onClose={this.props.onClose}>
        <ModalTitle>{this.props.title}</ModalTitle>
        <ModalContent>
          {this.props.content || "This action cannot be undone."}
        </ModalContent>
        <ModalCall>
          <TextButton onClick={this.props.onCancel || this.props.onClose}>
            Cancel
          </TextButton>
          <TextButton onClick={this.deleteObject}>Delete</TextButton>
        </ModalCall>
      </Modal>
    );
  }
}
