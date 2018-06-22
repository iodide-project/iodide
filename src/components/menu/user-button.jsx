import React from 'react'
import PropTypes from 'prop-types';

import AccountCircle from 'material-ui-icons/AccountCircle'

import NotebookTaskButton from './notebook-task-button'
import tasks from '../../actions/task-definitions'

export default class UserButton extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  }

  render() {
    if (!this.props.isAuthenticated) {
      return (
        <NotebookTaskButton task={tasks.logoutGithub}>
          <img src={this.props.avatar} alt="" className="user-avatar" />
        </NotebookTaskButton>
      )
    }

    // not authenticated, just return a button inviting them to log in
    return (
      <NotebookTaskButton task={tasks.loginGithub}>
        <AccountCircle />
      </NotebookTaskButton>
    )
  }
}
