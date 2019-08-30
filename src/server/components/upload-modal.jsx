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
    onCloseOrCancel: PropTypes.func,
    onUpdateFile: PropTypes.func,
    oldFile: PropTypes.shape({
      filename: PropTypes.string
    }),
    aboveOtherModals: PropTypes.bool
  };
  render() {
    return (
      <Modal
        visible={this.props.visible}
        onCloseOrCancel={this.props.onCloseOrCancel}
        aboveOtherModals={this.props.aboveOtherModals}
      >
        <ModalTitle>{`replace notebook file  "${(this.props.oldFile &&
          this.props.oldFile.filename) ||
          ""}"?`}</ModalTitle>
        <ModalContent>
          This action will replace the file associated with this notebook, and
          cannot be undone. Any other files with the same name associated with
          other notebooks will not be affected.
        </ModalContent>
        <ModalCall>
          <TextButton onClick={this.props.onCloseOrCancel}>Cancel</TextButton>
          <TextButton onClick={this.props.onUpdateFile}>
            Replace File
          </TextButton>
        </ModalCall>
      </Modal>
    );
  }
}
