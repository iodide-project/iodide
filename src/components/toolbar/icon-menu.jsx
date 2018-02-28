import React from 'react'
import IconMenu from 'material-ui/IconMenu'

const NotebookIconMenu = props => (
  <IconMenu
    iconButtonElement={props.icon}
    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
    desktop
    className="menu-button"
  >
    {props.children}
  </IconMenu>
)

NotebookIconMenu.muiName = 'IconMenu'
export default NotebookIconMenu
