import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import ExpandMore from '@material-ui/icons/ExpandMore'

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import Tooltip from '@material-ui/core/Tooltip'

import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import NotebookMenuDivider from '../../components/menu/notebook-menu-divider'

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorElement: null,
      isLoggedIn: props.userInfo && props.userInfo.name,
    }

    this.handleClick = this.handleClick.bind(this)
    this.goToProfile = this.goToProfile.bind(this)
    this.handleMenuClose = this.handleMenuClose.bind(this)
    this.logout = this.logout.bind(this)
  }

  handleClick(event) {
    this.setState({ anchorElement: event.currentTarget })
  }

  handleMenuClose() {
    this.setState({ anchorElement: null })
  }

  goToProfile() {
    const { name } = this.props.userInfo
    // const a = document.createElement('a')
    document.location = `/users/${name}`
  }

  login() {
    const url = '/oauth/login/github'
    const name = 'github_login'
    const specs = 'width=500,height=600'
    const authWindow = window.open(url, name, specs)
    authWindow.focus()

    window.loginSuccess = () => {
      this.setState({ isLoggedIn: true })
    }
    window.loginFailure = () => {
      // do something smart here (probably pop up a notification)
    }
  }

  logout() {
    fetch('/logout/')
      .then((response) => {
        if (response.ok) {
          this.setState({ isLoggedIn: false })
        } else {
          // do something smart here (probably pop up a notification)
        }
      });
  }

  render() {
    const { anchorElement } = this.state
    return (
      <Tooltip classes={{ tooltip: 'iodide-tooltip' }} title="Menu">
        <React.Fragment>
          {
              this.state.isLoggedIn && (
                <React.Fragment>
                  <Menu
                    dense="true"
                    id="user-controls"
                    anchorEl={document.getElementById('user-controls-button')}
                    open={Boolean(anchorElement)}
                    onClose={this.handleMenuClose}
                    transitionDuration={50}
                  >
                    <MenuItem dense>
                      <ListItemText onClick={this.goToProfile} primary="Go to Profile" />
                    </MenuItem>
                    <NotebookMenuDivider />
                    <MenuItem dense>
                      <ListItemText onClick={this.logout} primary="Log Out" />
                    </MenuItem>
                  </Menu>
                  <Button
                    id="user-controls-button"
                    size="small"
                    disableRipple
                    aria-label="more"
                    aria-owns={anchorElement ? 'user-controls' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    style={{ color: 'white' }}
                  >
                    <Avatar sizes="5" src={this.props.userInfo.avatar} />
                    <ExpandMore />
                  </Button>
                </React.Fragment>
              )
            }
          {
              !this.state.isLoggedIn && (
                <Button
                  variant="contained"
                  className="header-button"
                  href={`/oauth/login/github/?next=${window.location.pathname}`}
                >
                  Log In
                </Button>
              )
            }
        </React.Fragment>
      </Tooltip>
    )
  }
}
