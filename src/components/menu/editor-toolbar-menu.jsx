import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import NotebookIconMenu from './icon-menu'
import tasks from '../../actions/task-definitions'
import NotebookMenuItem from './notebook-menu-item'
import { connectionModeIsStandalone } from '../../tools/server-tools'


export class EditorToolbarMenuUnconnected extends React.Component {
  static propTypes = {
    isStandalone: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  }

  render() {
    return (
      <NotebookIconMenu>
        <NotebookMenuItem disabled={this.props.isStandalone} task={tasks.newNotebook} />
        <NotebookMenuItem task={tasks.exportNotebook} />
        <NotebookMenuItem task={tasks.exportNotebookAsReport} />
        <NotebookMenuItem task={tasks.clearVariables} />
        {
          this.props.isAuthenticated && <NotebookMenuItem task={tasks.saveNotebook} />
        }
        <NotebookMenuItem task={tasks.toggleHelpModal} />
      </NotebookIconMenu>

    )
  }
}

export function mapStateToProps(state) {
  const isAuthenticated = Boolean(state.userData.name)
  const isStandalone = connectionModeIsStandalone(state)
  return {
    isAuthenticated,
    isStandalone,
  }
}

export default connect(mapStateToProps)(EditorToolbarMenuUnconnected)
