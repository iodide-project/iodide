import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import UserMenu from "../../shared/user-menu";
import ViewModeToggleButton from "./view-mode-toggle-button";
import LastSavedText from "./last-saved-text";

import KernelState from "./kernel-state";

import tasks from "../../actions/task-definitions";

import { connectionModeIsServer } from "../../tools/server-tools";

export class ViewControlsUnconnected extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    name: PropTypes.string,
    avatar: PropTypes.string,
    isServer: PropTypes.bool.isRequired
  };

  render() {
    return (
      <div className="view-controls">
        <LastSavedText />
        <KernelState />
        {this.props.isServer && (
          <UserMenu
            isAuthenticated={this.props.isAuthenticated}
            loginCallback={tasks.loginGithub.callback}
            logoutCallback={tasks.logoutGithub.callback}
            avatar={this.props.avatar}
            username={this.props.name}
          />
        )}

        <ViewModeToggleButton />
      </div>
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
