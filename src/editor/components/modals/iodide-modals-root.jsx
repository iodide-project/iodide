import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Modal from "@material-ui/core/Modal";

import { setModalState } from "../../actions/actions";

import HelpModal from "./help-modal";
import HistoryModal from "./history-modal";

export class IodideModalRootUnconnected extends React.Component {
  static propTypes = {
    modalState: PropTypes.string.isRequired,
    closeModals: PropTypes.func.isRequired
  };

  render() {
    const { modalState } = this.props;
    let modalContents;
    switch (modalState) {
      case "HISTORY_MODAL":
        modalContents = <HistoryModal />;
        break;
      case "HELP_MODAL":
        modalContents = <HelpModal />;
        break;
      default:
        modalContents = <div>(empty modal placeholder)</div>;
    }

    return (
      <Modal
        open={modalState !== "MODALS_CLOSED"}
        onEscapeKeyDown={this.props.closeModals}
        onBackdropClick={this.props.closeModals}
      >
        {modalContents}
      </Modal>
    );
  }
}

export function mapStateToProps(state) {
  return {
    modalState: state.modalState
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    closeModals: () => dispatch(setModalState("MODALS_CLOSED"))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IodideModalRootUnconnected);
