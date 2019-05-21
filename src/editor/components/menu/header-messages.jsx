import React from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import LoginModal from "../../../shared/components/login-modal";

import {
  connectionModeIsServer,
  connectionModeIsStandalone
} from "../../tools/server-tools";
import { login } from "../../actions/actions";
import {
  createNewNotebookOnServer,
  revertToLatestServerRevision,
  saveNotebookToServer
} from "../../actions/server-save-actions";

const HeaderMessageContainer = styled("div")`
  background-color: lightyellow;
  padding: 5px;
  border-bottom: darkgrey solid 1px;

  a {
    color: #0366d6;
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  a:active,
  a:hover {
    outline-width: 0;
  }
`;

export class HeaderMessagesUnconnected extends React.Component {
  static propTypes = {
    message: PropTypes.oneOf([
      "NOTEBOOK_REVISION_ID_OUT_OF_DATE",
      "STANDALONE_MODE",
      "NEED_TO_LOGIN",
      "NEED_TO_MAKE_COPY",
      "SERVER_ERROR_GENERAL",
      "SERVER_ERROR_UNAUTHORIZED",
      "SERVER_ERROR_OUT_OF_DATE"
    ]),
    owner: PropTypes.string,
    saveNotebookToServer: PropTypes.func.isRequired,
    revertToLatestServerRevision: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    createNewNotebookOnServer: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showLoginModal: false
    };
    this.showLoginModal = this.showLoginModal.bind(this);
    this.hideLoginModal = this.hideLoginModal.bind(this);
  }

  showLoginModal() {
    this.setState({ showLoginModal: true });
  }

  hideLoginModal() {
    this.setState({ showLoginModal: false });
  }

  render() {
    let content;
    switch (this.props.message) {
      case "NOTEBOOK_REVISION_ID_OUT_OF_DATE":
        content = (
          <React.Fragment>
            This notebook is based on an old revision. You can either{" "}
            <a onClick={this.props.revertToLatestServerRevision}>replace</a> it
            with the latest version on the server or{" "}
            <a onClick={() => this.props.saveNotebookToServer(true)}>
              save over it
            </a>{" "}
            with this copy.
          </React.Fragment>
        );
        break;
      case "SERVER_ERROR_UNAUTHORIZED":
        content = (
          <React.Fragment>
            Error saving changes to the server: it seems like your session may
            have expired. You may be able to resolve this issue by{" "}
            <a onClick={this.showLoginModal}>logging in again</a>.
          </React.Fragment>
        );
        break;
      case "SERVER_ERROR_GENERAL":
        content =
          "Connection to the server has been lost. We'll keep trying. In the meantime, your changes will be preserved locally.";
        break;
      case "STANDALONE_MODE":
        content =
          "You're viewing this notebook in standalone mode. You can modify this notebook freely, but your changes will not be saved.";
        break;
      case "NEED_TO_LOGIN":
        content = (
          <React.Fragment>
            You can modify and experiment with this notebook freely. To save
            your work, you need to <a onClick={this.showLoginModal}>login</a>.
          </React.Fragment>
        );
        break;
      case "NEED_TO_MAKE_COPY":
        content = (
          <React.Fragment>
            This notebook is owned by{" "}
            <a href={`/${this.props.owner}`}>{this.props.owner}</a>.{" "}
            <a onClick={this.props.createNewNotebookOnServer}>
              Make a copy to your account
            </a>{" "}
            if you want to save any modifications.
          </React.Fragment>
        );
        break;
      default:
        return null;
    }

    return (
      <HeaderMessageContainer>
        {content}
        <LoginModal
          visible={this.state.showLoginModal}
          onClose={this.hideLoginModal}
          login={this.props.login}
        />
      </HeaderMessageContainer>
    );
  }
}

export function mapStateToProps(state) {
  if (state.viewMode === "EXPLORE_VIEW") {
    if (connectionModeIsStandalone(state)) {
      return { message: "STANDALONE_MODE" };
    } else if (
      state.userData.name === undefined &&
      connectionModeIsServer(state)
    ) {
      return { message: "NEED_TO_LOGIN" };
    } else if (
      !state.notebookInfo.user_can_save &&
      connectionModeIsServer(state)
    ) {
      return {
        message: "NEED_TO_MAKE_COPY",
        owner: state.notebookInfo.username
      };
    } else if (state.notebookInfo.serverSaveStatus === "ERROR_GENERAL") {
      return { message: "SERVER_ERROR_GENERAL" };
    } else if (state.notebookInfo.serverSaveStatus === "ERROR_OUT_OF_DATE") {
      return {
        message: "NOTEBOOK_REVISION_ID_OUT_OF_DATE"
      };
    } else if (state.notebookInfo.serverSaveStatus === "ERROR_UNAUTHORIZED") {
      return { message: "SERVER_ERROR_UNAUTHORIZED" };
    } else if (!state.notebookInfo.revision_is_latest) {
      return {
        message: "NOTEBOOK_REVISION_ID_OUT_OF_DATE"
      };
    }
  }

  return {};
}

const mapDispatchToProps = {
  login,
  saveNotebookToServer,
  createNewNotebookOnServer,
  revertToLatestServerRevision
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderMessagesUnconnected);
