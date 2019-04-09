import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "react-emotion";

import HelpOutline from "@material-ui/icons/HelpOutline";

import UserMenu from "../../../shared/components/user-menu";
import ViewModeToggleButton from "./view-mode-toggle-button";
import NotebookTaskButton from "./notebook-task-button";
import KernelState from "./kernel-state";

// FIXME there is NO REASON to use "tasks" here.
// we should use map dispatch to props and regular actions like
// we do in every other component
import tasks from "../../user-tasks/task-definitions";

import { connectionModeIsServer } from "../../tools/server-tools";

const ViewControlsContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: end;
`;

export class ViewControlsUnconnected extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    name: PropTypes.string,
    avatar: PropTypes.string,
    isServer: PropTypes.bool.isRequired
  };

  render() {
    return (
      <ViewControlsContainer>
        <KernelState />
        <NotebookTaskButton task={tasks.toggleHelpModal}>
          <HelpOutline />
        </NotebookTaskButton>
        {this.props.isServer && (
          // FIXME: userment should be its own connected component.
          // this stuff should not be passed down as props
          <UserMenu
            isAuthenticated={this.props.isAuthenticated}
            loginCallback={tasks.loginGithub.callback}
            logoutCallback={tasks.logoutGithub.callback}
            avatar={this.props.avatar}
            username={this.props.name}
          />
        )}

        <ViewModeToggleButton />
      </ViewControlsContainer>
    );
  }
}

export function mapStateToProps(state) {
  const isAuthenticated = Boolean(state.userData.name);
  return {
    isAuthenticated,
    name: state.userData.name,
    avatar: state.userData.avatar,
    isServer: connectionModeIsServer(state)
  };
}

export default connect(mapStateToProps)(ViewControlsUnconnected);
