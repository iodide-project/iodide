import React from 'react'
import NotebookMenuSubsection from './notebook-menu-subsection'
import NotebookMenuItem from './notebook-menu-item'
import tasks from '../../task-definitions'

export default class ViewModeToggleSubsection extends React.Component {
  render() {
    return (
      <NotebookMenuSubsection title="view ..." {...this.props}>
        <NotebookMenuItem task={tasks.toggleHistoryPane} />
        <NotebookMenuItem task={tasks.toggleDeclaredVariablesPane} />
      </NotebookMenuSubsection>
    )
  }
}
