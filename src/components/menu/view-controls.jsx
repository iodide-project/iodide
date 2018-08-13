/* global IODIDE_BUILD_TYPE */
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
// import { ToolbarGroup } from '@material-ui/core/Toolbar'

// import HistoryIcon from '@material-ui/icons/History'
// import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import InfoIcon from '@material-ui/icons/InfoOutline'
// import SvgIcon from '@material-ui/core/SvgIcon'

import NotebookTaskButton from './notebook-task-button'
import UserButton from './user-button'
import ViewModeToggleButton from './view-mode-toggle-button'
import LastSavedText from './last-saved-text'
// import AppInfoPane from '../panes/app-info-pane'

import tasks from '../../actions/task-definitions'
import DeclaredVariableIcon from './declared-variable-icon'
import ConsoleIcon from './console-icon'


export class ViewControlsUnconnected extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  }

  render() {
    return (
      <div className="view-controls">
        <LastSavedText />

        <NotebookTaskButton task={tasks.toggleAppInfoPane}>
          <InfoIcon />
        </NotebookTaskButton>

        <NotebookTaskButton task={tasks.toggleDeclaredVariablesPane}>
          <DeclaredVariableIcon />
        </NotebookTaskButton>

        <NotebookTaskButton task={tasks.toggleHistoryPane}>
          <ConsoleIcon />
        </NotebookTaskButton>

        {/* <AppInfoPane /> */}

        {IODIDE_BUILD_TYPE === 'server' && (
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
