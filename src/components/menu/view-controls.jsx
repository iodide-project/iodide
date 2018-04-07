import React from 'react'
// import { ToolbarGroup } from 'material-ui/Toolbar'

import HistoryIcon from 'material-ui-icons/History'
import ArrowDropDown from 'material-ui-icons/ArrowDropDown'
import InfoIcon from 'material-ui-icons/InfoOutline'

import NotebookTaskButton from './notebook-task-button'
import ViewModeToggleButton from './view-mode-toggle-button'
import LastSavedText from './last-saved-text'
import DeclaredVariablesPane from '../panes/declared-variables-pane'
import HistoryPane from '../panes/history-pane'
import AppInfoPane from '../panes/app-info-pane'

import tasks from '../../actions/task-definitions'


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

        <NotebookTaskButton task={tasks.toggleAppInfoPane}>
          <InfoIcon />
        </NotebookTaskButton>


        <DeclaredVariablesPane />
        <HistoryPane />
        <AppInfoPane />

        <ViewModeToggleButton />

      </div>
    )
  }
}

