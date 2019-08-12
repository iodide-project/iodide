import React from "react";
import PropTypes from "prop-types";
import Modal from "../../../shared/components/modal";
import ModalTitle from "../../../shared/components/modal-title";
import ModalContent from "../../../shared/components/modal-content";
import ModalCall from "../../../shared/components/modal-call";
import { TextButton } from "../../../shared/components/buttons";

export default class DeleteModal extends React.Component {
  static propTypes = {
    onCloseOrCancel: PropTypes.func.isRequired,
    onRevert: PropTypes.func.isRequired,
    visible: PropTypes.bool,
    aboveOtherModals: PropTypes.bool
  };

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onCloseOrCancel={this.props.onCloseOrCancel}
        aboveOtherModals={this.props.aboveOtherModals}
      >
        <ModalTitle>Revert to this revision</ModalTitle>
        <ModalContent>This action cannot be undone.</ModalContent>
        <ModalCall>
          <TextButton onClick={this.props.onCloseOrCancel}>Cancel</TextButton>
          <TextButton onClick={this.props.onRevert}>Revert</TextButton>
        </ModalCall>
      </Modal>
    );
  }
}
