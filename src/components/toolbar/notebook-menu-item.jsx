// need currentlySelectedCellType() == 'javascript' or whatever
// checked={true}

import React from 'react'
import PropTypes from 'prop-types'
import MenuItem from 'material-ui/MenuItem'

import UserTask from '../../user-task'
import ExternalLinkTask from '../../external-link-task'


export default class NotebookMenuItem extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    task: PropTypes.oneOfType([
      PropTypes.instanceOf(UserTask),
      PropTypes.instanceOf(ExternalLinkTask),
    ]),
  }
  render() {
    return (<MenuItem
      className={this.props.className || undefined}
      key={this.props.task.title}
      style={{ fontSize: '13px', width: '300px !important' }}
      primaryText={this.props.task.menuTitle}
      secondaryText={this.props.task.displayKeybinding}
      onClick={this.props.task.callback}
    />)
  }
}
