import React from 'react'
import { ToolbarGroup } from 'material-ui/Toolbar'

import HistoryIcon from 'material-ui/svg-icons/action/history'
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down'

import NotebookTaskButton from './notebook-task-button'
import ViewModeToggleButton from './view-mode-toggle-button'
import LastSavedText from './last-saved-text'

import tasks from '../../task-definitions'

export default class ViewControls extends React.Component {
  render() {
    return (
      <ToolbarGroup id="notebook-view-mode-controls" className="mode-buttons">

        <LastSavedText />

        <NotebookTaskButton task={tasks.toggleDeclaredVariablesPane}>
          <ArrowDropDown />
        </NotebookTaskButton>

        <NotebookTaskButton task={tasks.toggleHistoryPane}>
          <HistoryIcon />
        </NotebookTaskButton>

        <ViewModeToggleButton />

      </ToolbarGroup>

    )
  }
}

