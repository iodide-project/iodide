import React from 'react'
import IconMenu from 'material-ui/IconMenu'

export default class NotebookIconMenu extends React.Component {
  render() {
    return (
      <IconMenu
        iconButtonElement={this.props.icon}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        menuStyle={{ width: '400px !important' }}
        listStyle={{ width: '350px !important' }}
        desktop
        className="menu-button"
      >
        {this.props.children}
      </IconMenu>
    )
  }
}

// menuStyle={{ width: '400px !important' }}
// listStyle={{ width: '300px !important' }}
