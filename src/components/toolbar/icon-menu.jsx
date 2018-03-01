import React from 'react'
// import IconMenu from 'material-ui/IconMenu'

import IconButton from 'material-ui/IconButton'
import Menu from 'material-ui/Menu'
import MenuIcon from 'material-ui-icons/Menu'

export default class NotebookIconMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorElement: null,
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  handleClick(event) {
    this.setState({ anchorElement: event.currentTarget })
  }

  handleClose() {
    this.setState({ anchorElement: null })
  }

  render() {
    const { anchorElement } = this.state
    const children = React.Children.map(this.props.children, c =>
      React.cloneElement(c, { onClick: this.handleClose }))
    return (
      <IconButton
        aria-label="more"
        aria-owns={anchorElement ? 'main-menu' : null}
        aria-haspopup="true"
        onClick={this.handleClick}
        style={{ color: 'white' }}
      >
        <MenuIcon />
        <Menu
          id="main-menu"
          anchorEl={this.state.anchorElement}
          open={Boolean(anchorElement)}
          onClose={this.handleClose}
          anchorReference="anchorPosition"
          anchorPosition={{ top: 62, left: 30 }}
        >
          {children}
        </Menu>
      </IconButton>

    )
  }
}
