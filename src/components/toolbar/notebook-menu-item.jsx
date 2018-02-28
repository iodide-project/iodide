// need currentlySelectedCellType() == 'javascript' or whatever
// checked={true}

import React from 'react'
import PropTypes from 'prop-types'
import MenuItem from 'material-ui/MenuItem'

import UserTask from '../../user-task'
import ExternalLinkTask from '../../external-link-task'


// const NotebookMenuItem = props => (
//   <MenuItem
//     className={props.className || undefined}
//     key={props.task.title}
//     style={{ fontSize: '13px' }}
//     primaryText={props.task.menuTitle}
//     secondaryText={props.task.displayKeybinding}
//     onClick={props.task.callback}
//   />
// )
// NotebookMenuItem.muiName = 'MenuItem'

// export default NotebookMenuItem

export default class NotebookMenuItem extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    task: PropTypes.oneOfType([
      PropTypes.instanceOf(UserTask),
      PropTypes.instanceOf(ExternalLinkTask),
    ]),
  }
  static muiName = 'MenuItem'
  render() {
    return (<MenuItem
      className={this.props.className || undefined}
      key={this.props.task.title}
      style={{ fontSize: '13px', minHeight: '36px !important', lineHeight: '36px' }}
      primaryText={this.props.task.menuTitle}
      secondaryText={this.props.task.displayKeybinding}
      onClick={this.props.task.callback}
    />)
  }
}
