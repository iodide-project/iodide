import React from 'react'
// import IconMenu from 'material-ui/IconMenu'

import IconButton from 'material-ui/IconButton'
import Menu from 'material-ui/Menu'
import MenuIcon from 'material-ui-icons/Menu'
import Tooltip from 'material-ui/Tooltip'

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
      <Tooltip classes={{ tooltip: 'iodide-tooltip' }} title="Menu">
        <React.Fragment>
          <Menu
            id="main-menu"
            anchorEl={document.getElementById('editor-mode-controls')}
            open={Boolean(anchorElement)}
            onClose={this.handleIconButtonClose}
            anchorReference="anchorPosition"
            transitionDuration={70}
            anchorPosition={{ top: 50, left: 0 }}
          >
            {children}
          </Menu>
          <IconButton
            aria-label="more"
            aria-owns={anchorElement ? 'main-menu' : null}
            aria-haspopup="true"
            onClick={this.handleClick}
            style={{ color: 'white' }}
          >
            <MenuIcon />
          </IconButton>
        </React.Fragment>
      </Tooltip>
    )
  }
}
