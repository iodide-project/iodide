import React from 'react'
import MenuItem from 'material-ui/Menu/MenuItem'
import { ListItemText } from 'material-ui/List';
import Menu from 'material-ui/Menu'

import ChevronRight from 'material-ui-icons/ChevronRight'

export default class NotebookMenuSubsection extends React.Component {
  constructor(props) {
    super(props)
    this.state = { anchorElement: null }
    this.muiName = 'MenuItem'
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  handleClick(event) {
    if (this.state.anchorElement === null) {
      this.setState({ anchorElement: event.currentTarget })
    }
  }

  handleClose() {
    this.setState({ anchorElement: null })
  }
  render() {
    const { anchorElement } = this.state
    const children = React.Children.map(
      this.props.children,
      (c) => {
        if (c === null || c === undefined) return undefined
        return React.cloneElement(c, {
          onClick: () => {
            this.handleClose()
            if (this.props.onClick) this.props.onClick()
          },
        })
      },
    )
    return (
      <MenuItem
        classes={{ root: 'iodide-menu-item' }}
        aria-label="more"
        aria-owns={anchorElement ? 'sub-menu' : null}
        aria-haspopup="true"
        onClick={this.handleClick}
        style={{ color: 'white' }}
      >
        <ListItemText
          classes={{ root: 'primary-menu-item' }}
          primary={this.props.title}
        />
        <ListItemText
          classes={{ root: 'secondary-menu-item' }}
          primary={<ChevronRight style={{ width: 16, height: 16, marginTop: 5 }} />}
        />
        <Menu
          id="sub-menu"
          anchorEl={this.state.anchorElement}
          open={Boolean(anchorElement)}
          onClose={this.handleClose}
          transitionDuration={50}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {children}
        </Menu>
      </MenuItem>
    )
  }
}
