import React from 'react'
import PropTypes from 'prop-types'
import MenuItem from 'material-ui/Menu/MenuItem'
import { ListItemText } from 'material-ui/List';
import UserTask from '../../actions/user-task'
import ExternalLinkTask from '../../actions/external-link-task'

export default class NotebookMenuItem extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    submenuOnClick: PropTypes.func,
    task: PropTypes.oneOfType([
      PropTypes.instanceOf(UserTask),
      PropTypes.instanceOf(ExternalLinkTask),
    ]),
  }
  static muiName = 'MenuItem'

  constructor(props) {
    super(props)
    this.extraMenuProps = {}
    Object.keys(this.props).forEach((k) => {
      if (!['task', 'submenuOnClick', 'onClick'].includes(k)) {
        this.extraMenuProps[k] = this.props[k]
      }
    })
  }

  render() {
    return (
      <MenuItem
        {...this.extraMenuProps}
        classes={{ root: 'iodide-menu-item' }}
        key={this.props.task.title}
        onClick={() => {
          this.props.task.callback()
          if (this.props.onClick) this.props.onClick()
          if (this.props.submenuOnClick) this.props.submenuOnClick()
          }}
      >
        <ListItemText
          classes={{ root: 'primary-menu-item' }}
          primary={this.props.task.menuTitle}
        />
        <ListItemText
          style={{ marginRight: 5 }}
          classes={{ root: 'secondary-menu-item' }}
          primary={this.props.task.displayKeybinding || this.props.task.secondaryText}
        />

      </MenuItem>
    )
  }
}
