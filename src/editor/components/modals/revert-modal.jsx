import React from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";

import Modal from "../../../shared/components/modal";
import ModalTitle from "../../../shared/components/modal-title";
import ModalContent from "../../../shared/components/modal-content";
import ModalCall from "../../../shared/components/modal-call";
import { TextButton } from "../../../shared/components/buttons";

export default class RevertModal extends React.Component {
  static propTypes = {
    onCloseOrCancel: PropTypes.func.isRequired,
    onRevert: PropTypes.func.isRequired,
    visible: PropTypes.bool,
    date: PropTypes.string
  };

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onCloseOrCancel={this.props.onCloseOrCancel}
        aboveOtherModals
      >
        <ModalTitle>Restore this revision?</ModalTitle>
        <ModalContent>
          {`This will restore your notebook to version from ${
            this.props.date
              ? format(new Date(this.props.date), "MMM dd, uuuu HH:mm:ss")
              : ""
          }`}
        </ModalContent>
        <ModalCall>
          <TextButton onClick={this.props.onCloseOrCancel}>Cancel</TextButton>
          <TextButton onClick={this.props.onRevert}>Revert</TextButton>
        </ModalCall>
      </Modal>
    );
  }
}
