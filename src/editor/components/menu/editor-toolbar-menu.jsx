import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import NotebookIconMenu from "./icon-menu";
import tasks from "../../user-tasks/task-definitions";
import NotebookMenuItem from "./notebook-menu-item";
import {
  connectionModeIsServer,
  notebookIsATrial
} from "../../tools/server-tools";

export class EditorToolbarMenuUnconnected extends React.Component {
  static propTypes = {
    isServer: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool,
    isTrialNotebook: PropTypes.bool
  };

  render() {
    return (
      <NotebookIconMenu>
        {this.props.isServer && <NotebookMenuItem task={tasks.newNotebook} />}
        <NotebookMenuItem
          task={tasks.makeCopy}
          disabled={!this.props.isLoggedIn}
        />
        <NotebookMenuItem
          task={tasks.toggleHistoryModal}
          disabled={this.props.isTrialNotebook}
        />
        {this.props.isServer && (
          <NotebookMenuItem task={tasks.toggleFileModal} />
        )}
        <NotebookMenuItem task={tasks.clearVariables} />
        <NotebookMenuItem task={tasks.toggleHelpModal} />
      </NotebookIconMenu>
    );
  }
}

export function mapStateToProps(state) {
  const isServer = connectionModeIsServer(state);

  return {
    isServer,
    isLoggedIn: isServer && state.userData.name,
    isTrialNotebook: isServer && notebookIsATrial(state)
  };
}

export default connect(mapStateToProps)(EditorToolbarMenuUnconnected);
