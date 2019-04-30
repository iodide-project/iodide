import React from "react";
import PropTypes from "prop-types";
import Modal from "../../shared/components/modal";
import ModalTitle from "../../shared/components/modal-title";
import ModalContent from "../../shared/components/modal-content";
import ModalCall from "../../shared/components/modal-call";
import { TextButton } from "../../shared/components/buttons";

export default class UploadModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onCancel: PropTypes.func,
    onUpdateFile: PropTypes.func,
    oldFile: PropTypes.shape({
      filename: PropTypes.string
    })
  };
  render() {
    return (
      <Modal visible={this.props.visible} onClose={this.props.onClose}>
        <ModalTitle>{`replace notebook file  "${(this.props.oldFile &&
          this.props.oldFile.filename) ||
          ""}"?`}</ModalTitle>
        <ModalContent>
          This action will replace the file associated with this notebook, and
          cannot be undone. Any other files with the same name associated with
          other notebooks will not be affected.
        </ModalContent>
        <ModalCall>
          <TextButton onClick={this.props.onCancel || this.props.onClose}>
            Cancel
          </TextButton>
          <TextButton onClick={this.props.onUpdateFile}>
            Replace File
          </TextButton>
        </ModalCall>
      </Modal>
    );
  }
}
