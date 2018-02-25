import React from 'react'
import IconMenu from 'material-ui/IconMenu'

export default class NotebookIconMenu extends React.Component {
  render() {
    return (
      <IconMenu
        iconButtonElement={this.props.icon}
        anchorOrigin={this.props.anchorOrigin || { horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={this.props.targetOrigin || { horizontal: 'left', vertical: 'top' }}
        menuStyle={{ width: '500px !important' }}
        listStyle={{ width: '500px !important' }}
        desktop
        className="menu-button"
      >
        {this.props.children}
      </IconMenu>
    )
  }
}
