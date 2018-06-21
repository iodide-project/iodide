import React from 'react'
// import IconMenu from 'material-ui/IconMenu'

import IconButton from 'material-ui/IconButton'
import Menu from 'material-ui/Menu'
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
    document.querySelectorAll('div[class^="MuiBackdrop-"]').forEach((backdrop) => {
      backdrop.click();
    })
  }

  render() {
    const { anchorElement } = this.state
    const children = React.Children.map(this.props.children.filter(c => c), c =>
      React.cloneElement(c, { onClick: this.handleIconButtonClose }))
    return (
      <Tooltip classes={{ tooltip: 'iodide-tooltip' }} title="Menu">
        <React.Fragment>
          <Menu
            id="main-menu"
            anchorEl={document.querySelector(`.${this.props.anchorClass}`)}
            open={Boolean(anchorElement)}
            onClose={this.handleIconButtonClose}
            transitionDuration={10}
            anchorOrigin={this.props.position}
            getContentAnchorEl={null}
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
            {this.props.icon}
          </IconButton>
        </React.Fragment>
      </Tooltip>
    )
  }
}
