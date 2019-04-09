import React from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import LoginModal from "../../../shared/components/login-modal";

import {
  connectionModeIsServer,
  connectionModeIsStandalone
} from "../../tools/server-tools";
import {
  createNewNotebookOnServer,
  login,
  discardAutosave,
  loadAutosave
} from "../../actions/actions";

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
      "HAS_PREVIOUS_AUTOSAVE",
      "NOTEBOOK_REVISION_ID_OUT_OF_DATE",
      "STANDALONE_MODE",
      "NEED_TO_LOGIN",
      "NEED_TO_MAKE_COPY",
      "CONNECTION_LOST"
    ]),
    owner: PropTypes.string,
    loadAutosave: PropTypes.func.isRequired,
    discardAutosave: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    makeCopy: PropTypes.func.isRequired,
    notebookId: PropTypes.number,
    revisionId: PropTypes.number,
    connectionModeIsServer: PropTypes.bool
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
      case "HAS_PREVIOUS_AUTOSAVE":
        content = (
          <React.Fragment>
            {this.props.connectionModeIsServer
              ? "You have made changes to this notebook that are only saved locally."
              : "Modifications to notebook detected in browser's local storage."}
            &nbsp;
            <a onClick={this.props.loadAutosave}>Restore</a>
            &nbsp;or&nbsp;
            <a onClick={this.props.discardAutosave}>discard</a>.
          </React.Fragment>
        );
        break;
      case "NOTEBOOK_REVISION_ID_OUT_OF_DATE":
        content = (
          <React.Fragment>
            You are viewing an old version of this notebook. Editing is
            disabled. &nbsp;
            <a href={`/notebooks/${this.props.notebookId}/`}>
              Load latest version
            </a>
            .
          </React.Fragment>
        );
        break;
      case "CONNECTION_LOST":
        content =
          "Connection to the server has been lost. We'll keep trying. In the meantime, your changes will be preserved locally.";
        break;
      case "STANDALONE_MODE":
        content =
          "You're viewing this notebook in standalone mode. Changes will be cached in your browser's local storage, but will not be otherwise persisted.";
        break;
      case "NEED_TO_LOGIN":
        content = (
          <React.Fragment>
            You can modify and experiment with this notebook freely. To save to
            this server, you need to <a onClick={this.showLoginModal}>login</a>.
          </React.Fragment>
        );
        break;
      case "NEED_TO_MAKE_COPY":
        content = (
          <React.Fragment>
            This notebook is owned by{" "}
            <a href={`/${this.props.owner}`}>{this.props.owner}</a>. {}
            <a onClick={() => this.props.makeCopy(this.props.revisionId)}>
              Make a copy to your account
            </a>
            .
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
    if (
      state.hasPreviousAutosave &&
      state.userData.name !== undefined &&
      state.notebookInfo.username !== state.userData.name
    ) {
      // this checks if there is a previous autosave,
      // and if the user matches.
      return {
        message: "HAS_PREVIOUS_AUTOSAVE",
        connectionModeIsServer: connectionModeIsServer(state)
      };
    } else if (connectionModeIsStandalone(state)) {
      return { message: "STANDALONE_MODE" };
    } else if (state.notebookInfo.revision_is_latest === false) {
      return {
        message: "NOTEBOOK_REVISION_ID_OUT_OF_DATE",
        notebookId: state.notebookInfo.notebook_id
      };
    } else if (state.notebookInfo.connectionStatus === "CONNECTION_LOST") {
      return { message: "CONNECTION_LOST" };
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
        revisionId: state.notebookInfo.revision_id,
        owner: state.notebookInfo.username
      };
    }
  }

  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    login: () => {
      dispatch(login());
    },
    discardAutosave: () => {
      dispatch(discardAutosave());
    },
    loadAutosave: () => {
      dispatch(loadAutosave());
    },
    makeCopy: revisionId => {
      dispatch(createNewNotebookOnServer({ forkedFrom: revisionId }));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderMessagesUnconnected);
