import React from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'

import UserTask from '../../user-task'
import ExternalLinkTask from '../../external-link-task'

// TODO - implement tooltip again
export default class NotebookTaskFunction extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    task: PropTypes.oneOfType([
      PropTypes.instanceOf(UserTask),
      PropTypes.instanceOf(ExternalLinkTask),
    ]),
  }
  static muiName='IconButton'
  render() {
    return (
      <IconButton
        classes={{ root: 'menu-button' }}
        className="menu-button"
        style={this.props.style || { color: '#fafafa' }}
        onClick={this.props.task.callback}
      >
        {this.props.children}
      </IconButton>
    )
  }
}
