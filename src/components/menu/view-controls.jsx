/* global IODIDE_BUILD_TYPE */
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import NotebookTaskButton from './notebook-task-button'
import UserMenu from '../../shared/user-menu'
import ViewModeToggleButton from './view-mode-toggle-button'
import LastSavedText from './last-saved-text'

export class ViewControlsUnconnected extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  }

  render() {
    return (
      <div className="view-controls">
        <LastSavedText />

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
