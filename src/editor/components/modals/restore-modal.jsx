import React from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";

import Modal from "../../../shared/components/modal";
import ModalTitle from "../../../shared/components/modal-title";
import ModalContent from "../../../shared/components/modal-content";
import ModalCall from "../../../shared/components/modal-call";
import { TextButton } from "../../../shared/components/buttons";

export default class RestoreModal extends React.Component {
  static propTypes = {
    onCloseOrCancel: PropTypes.func.isRequired,
    onRestore: PropTypes.func.isRequired,
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
          {`This will restore your notebook to the version from ${
            this.props.date
              ? format(new Date(this.props.date), "MMM dd, uuuu HH:mm:ss")
              : ""
          } by saving a copy of it as the most recent version. Your current changes will be preserved as a revision.`}
        </ModalContent>
        <ModalCall>
          <TextButton onClick={this.props.onCloseOrCancel}>Cancel</TextButton>
          <TextButton onClick={this.props.onRestore}>Restore</TextButton>
        </ModalCall>
      </Modal>
    );
  }
}
