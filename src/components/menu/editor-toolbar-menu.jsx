import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import NotebookIconMenu from './icon-menu'
import tasks from '../../actions/task-definitions'
import NotebookMenuItem from './notebook-menu-item'


export class EditorToolbarMenuUnconnected extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  }

  render() {
    return (
      <NotebookIconMenu>
        <NotebookMenuItem task={tasks.exportNotebook} />
        <NotebookMenuItem task={tasks.exportNotebookAsReport} />
        <NotebookMenuItem task={tasks.clearVariables} />
        {
          this.props.isAuthenticated && <NotebookMenuItem task={tasks.exportGist} />
        }
        <NotebookMenuItem task={tasks.toggleHelpModal} />
      </NotebookIconMenu>

    )
  }
}

export function mapStateToProps(state) {
  const isAuthenticated = Boolean(state.userData.accessToken)
  return {
    isAuthenticated,
  }
}

export default connect(mapStateToProps)(EditorToolbarMenuUnconnected)
