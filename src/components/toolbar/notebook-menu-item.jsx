// need currentlySelectedCellType() == 'javascript' or whatever
// checked={true}

import React from 'react'
import PropTypes from 'prop-types'
import MenuItem from 'material-ui/Menu/MenuItem'
import { ListItemText } from 'material-ui/List';
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
    return (
      <MenuItem
        dense
        classes={{ root: 'main-menu-item' }}
        key={this.props.task.title}
        onClick={this.props.task.callback}
      >
        <ListItemText
          classes={{ root: 'primary-menu-item' }}
          primary={this.props.task.menuTitle}
        />
        <ListItemText
          classes={{ root: 'secondary-menu-item' }}
          primary={this.props.task.displayKeybinding}
          secondary
        />

      </MenuItem>
    )
  }
}
