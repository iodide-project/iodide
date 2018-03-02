import React from 'react'

import NotebookIconMenu from './icon-menu'
import tasks from '../../task-definitions'
import NotebookMenuItem from './notebook-menu-item'
import NotebookMenuDivider from './notebook-menu-divider'

import CellMenuSubsection from './cell-menu-subsection'
import SavedNotebooksAndExamplesSubsection from './saved-notebooks-and-examples-subsection'
import ViewModeToggleSubsection from './view-mode-toggle-subsection'

export default class EditorToolbarMenu extends React.Component {
  render() {
    return (
      <NotebookIconMenu>
        <NotebookMenuItem task={tasks.createNewNotebook} />
        <NotebookMenuItem task={tasks.saveNotebook} />
        <NotebookMenuItem task={tasks.exportNotebook} />

        <SavedNotebooksAndExamplesSubsection />

        <CellMenuSubsection />

        <NotebookMenuDivider />

        <ViewModeToggleSubsection />

        <NotebookMenuDivider />

        <NotebookMenuItem task={tasks.fileAnIssue} />
      </NotebookIconMenu>

    )
  }
}
