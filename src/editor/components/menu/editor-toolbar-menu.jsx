import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import NotebookIconMenu from "./icon-menu";
import tasks from "../../user-tasks/task-definitions";
import NotebookMenuItem from "./notebook-menu-item";
import { connectionModeIsServer } from "../../tools/server-tools";

export class EditorToolbarMenuUnconnected extends React.Component {
  static propTypes = {
    isServer: PropTypes.bool.isRequired
  };

  render() {
    return (
      <NotebookIconMenu>
        {this.props.isServer && <NotebookMenuItem task={tasks.newNotebook} />}
        {this.props.isServer && (
          <NotebookMenuItem task={tasks.toggleHistoryModal} />
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
    isServer
  };
}

export default connect(mapStateToProps)(EditorToolbarMenuUnconnected);
