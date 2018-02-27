import React from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'

import UserTask from '../../user-task'
import ExternalLinkTask from '../../external-link-task'

export default class NotebookTaskFunction extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    task: PropTypes.oneOfType([
      PropTypes.instanceOf(UserTask),
      PropTypes.instanceOf(ExternalLinkTask),
    ]),
  }
  render() {
    return (
      <IconButton
        className="menu-button"
        tooltip={this.props.task.title}
        style={this.props.style || { color: '#fafafa' }}
        onClick={this.props.task.callback}
      >
        {this.props.children}
      </IconButton>
    )
  }
}
