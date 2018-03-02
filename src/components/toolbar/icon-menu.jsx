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
    this.handleIconButtonClose = this.handleIconButtonClose.bind(this)
  }
  handleClick(event) {
    this.setState({ anchorElement: event.currentTarget })
  }

  handleIconButtonClose() {
    this.setState({ anchorElement: null })
  }

  render() {
    const { anchorElement } = this.state
    const children = React.Children.map(this.props.children, c =>
      React.cloneElement(c, { onClick: this.handleIconButtonClose }))
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
          onClose={this.handleIconButtonClose}
          anchorReference="anchorPosition"
          anchorPosition={{ top: 62, left: 30 }}
        >
          {children}
        </Menu>
      </IconButton>

    )
  }
}
