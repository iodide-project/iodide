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
    canModifyNotebook: PropTypes.bool,
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
        <NotebookMenuItem
          task={tasks.toggleFileModal}
          disabled={!this.props.canModifyNotebook}
        />
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
    isTrialNotebook: isServer && notebookIsATrial(state),
    isLoggedIn: isServer && state.userData.name,
    canModifyNotebook: isServer && Boolean(state.notebookInfo.user_can_save)
  };
}

export default connect(mapStateToProps)(EditorToolbarMenuUnconnected);
