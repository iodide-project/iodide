/* global IODIDE_BUILD_MODE */
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
// import { ToolbarGroup } from 'material-ui/Toolbar'

import HistoryIcon from 'material-ui-icons/History'
import ArrowDropDown from 'material-ui-icons/ArrowDropDown'
import InfoIcon from 'material-ui-icons/InfoOutline'

import NotebookTaskButton from './notebook-task-button'
import UserButton from './user-button'
import ViewModeToggleButton from './view-mode-toggle-button'
import LastSavedText from './last-saved-text'
import DeclaredVariablesPane from '../panes/declared-variables-pane'
import HistoryPane from '../panes/history-pane'
import AppInfoPane from '../panes/app-info-pane'

import tasks from '../../actions/task-definitions'


export class ViewControlsUnconnected extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  }

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

        {IODIDE_BUILD_MODE === 'heroku' && (
          <UserButton
            isAuthenticated={this.props.isAuthenticated}
            avatar={this.props.avatar}
          />
        )}

        <ViewModeToggleButton />

      </div>
    )
  }
}

export function mapStateToProps(state) {
  const isAuthenticated = Boolean(state.userData.accessToken)
  return {
    isAuthenticated,
    name: state.userData.name,
    avatar: state.userData.avatar,
  }
}

export default connect(mapStateToProps)(ViewControlsUnconnected)
