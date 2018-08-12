import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import NotebookIconMenu from './icon-menu'
import tasks from '../../actions/task-definitions'
import NotebookMenuItem from './notebook-menu-item'
import NotebookMenuDivider from './notebook-menu-divider'

import SavedNotebooksAndExamplesSubsection from './saved-notebooks-and-examples-subsection'

export class EditorToolbarMenuUnconnected extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  }

  render() {
    return (
      <NotebookIconMenu>
        <NotebookMenuItem task={tasks.createNewNotebook} />
        <NotebookMenuItem task={tasks.saveNotebook} />
        <NotebookMenuItem task={tasks.exportNotebook} />
        <NotebookMenuItem task={tasks.exportNotebookAsReport} />
        <NotebookMenuItem task={tasks.exportNotebookToClipboard} />
        <NotebookMenuItem task={tasks.clearVariables} />
        <NotebookMenuItem task={tasks.saveNotebookToServer} />
        {
          this.props.isAuthenticated && <NotebookMenuItem task={tasks.exportGist} />
        }
        <SavedNotebooksAndExamplesSubsection />

        <NotebookMenuDivider />

        <NotebookMenuItem task={tasks.fileAnIssue} />
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
