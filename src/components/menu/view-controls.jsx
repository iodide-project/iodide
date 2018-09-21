/* global IODIDE_BUILD_TYPE */
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import InfoIcon from '@material-ui/icons/InfoOutlined'

import NotebookTaskButton from './notebook-task-button'
import UserMenu from '../../shared/user-menu'
import ViewModeToggleButton from './view-mode-toggle-button'
import LastSavedText from './last-saved-text'

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

        {IODIDE_BUILD_TYPE === 'server' && (
          <UserMenu
            isAuthenticated={this.props.isAuthenticated}
            loginCallback={tasks.loginGithub.callback}
            logoutCallback={tasks.logoutGithub.callback}
            avatar={this.props.avatar}
            username={this.props.name}
          />
        )}

        <ViewModeToggleButton />

      </div>
    )
  }
}

export function mapStateToProps(state) {
  const isAuthenticated = Boolean(state.userData.name)
  return {
    isAuthenticated,
    name: state.userData.name,
    avatar: state.userData.avatar,
  }
}

export default connect(mapStateToProps)(ViewControlsUnconnected)
