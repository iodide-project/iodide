import React from 'react'
// import { ToolbarGroup } from 'material-ui/Toolbar'

import HistoryIcon from 'material-ui-icons/History'
import ArrowDropDown from 'material-ui-icons/ArrowDropDown'

import NotebookTaskButton from './notebook-task-button'
import ViewModeToggleButton from './view-mode-toggle-button'
import LastSavedText from './last-saved-text'
import DeclaredVariablesPane from './declared-variables-pane'
import HistoryPane from './history-pane'

import tasks from '../../task-definitions'


export default class ViewControls extends React.Component {
  render() {
    return (
      <div className="view-controls">
        <LastSavedText />

        <NotebookTaskButton task={tasks.toggleDeclaredVariablesPane}>
          <ArrowDropDown />
        </NotebookTaskButton>

        <NotebookTaskButton task={tasks.toggleHistoryPane}>
          <HistoryIcon />
        </NotebookTaskButton>

        <DeclaredVariablesPane />
        <HistoryPane />
        <ViewModeToggleButton />

      </div>
    )
  }
}

