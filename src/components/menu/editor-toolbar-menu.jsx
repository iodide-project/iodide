import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import NotebookIconMenu from './icon-menu';
import tasks from '../../actions/task-definitions';
import NotebookMenuItem from './notebook-menu-item';
import NotebookMenuDivider from './notebook-menu-divider';

import CellMenuSubsection from './cell-menu-subsection';
import SavedNotebooksAndExamplesSubsection from './saved-notebooks-and-examples-subsection';
import ViewModeToggleSubsection from './view-mode-toggle-subsection';

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
        {
          this.props.isAuthenticated && <NotebookMenuItem task={tasks.exportGist} />
        }
        <SavedNotebooksAndExamplesSubsection />

        <CellMenuSubsection />

        <NotebookMenuDivider />

        <ViewModeToggleSubsection />

        <NotebookMenuDivider />

        <NotebookMenuItem task={tasks.fileAnIssue} />
      </NotebookIconMenu>

    );
  }
}

export function mapStateToProps(state) {
  const isAuthenticated = Boolean(state.userData.accessToken);
  return {
    isAuthenticated,
  };
}

export default connect(mapStateToProps)(EditorToolbarMenuUnconnected);
