import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import ExpandMore from '@material-ui/icons/ExpandMore'

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import Tooltip from '@material-ui/core/Tooltip'

import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import NotebookMenuDivider from '../components/menu/notebook-menu-divider'
import LoginModal from './login-modal'

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorElement: null,
      isLoggedIn: props.isAuthenticated,
      name: props.username,
      avatar: props.avatar,
      loginModalVisible: false,
    }

    this.handleClick = this.handleClick.bind(this)
    this.goToProfile = this.goToProfile.bind(this)
    this.handleMenuClose = this.handleMenuClose.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.showLoginModal = this.showLoginModal.bind(this)
    this.hideLoginModal = this.hideLoginModal.bind(this)
  }

  handleClick(event) {
    this.setState({ anchorElement: event.currentTarget })
  }

  handleMenuClose() {
    this.setState({ anchorElement: null })
  }

  goToProfile() {
    window.open(`/${this.state.name}`)
    this.handleMenuClose()
  }

  hideLoginModal() {
    this.setState({ loginModalVisible: false })
  }

  showLoginModal() {
    this.setState({ loginModalVisible: true })
  }

  login() {
    const loginSuccess = (args) => {
      if (this.props.refreshOnLoginLogout) {
        window.location.reload()
      }
      // else...
      if (args) {
        const { name, avatar } = args
        this.setState({ name, avatar })
      }
      this.setState({ isLoggedIn: true })
      this.handleMenuClose()
    }
    if (this.props.loginCallback) {
      this.props.loginCallback(loginSuccess)
    } else {
      const url = '/oauth/login/github'
      const name = 'github_login'
      const specs = 'width=500,height=600'
      const authWindow = window.open(url, name, specs)
      authWindow.focus()

      window.loginSuccess = loginSuccess

      window.loginFailure = () => {
      // do something smart here (probably pop up a notification)
        this.handleMenuClose()
      }
    }
  }

  logout() {
    if (this.props.logoutCallback) {
      this.props.logoutCallback()
      this.setState({ isLoggedIn: false })
    } else {
      fetch('/logout/')
        .then((response) => {
          if (response.ok) {
            if (this.props.refreshOnLoginLogout) {
              window.location.reload()
            }
            // else...
            this.setState({ isLoggedIn: false })
          } else {
          // do something smart here (probably pop up a notification)
            console.error('Login unsuccessful', response)
          }
        });
    }
    this.handleMenuClose()
  }

  render() {
    const { anchorElement } = this.state
    return (
      <Tooltip title="Menu">
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
                    transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
                    <Avatar style={{ width: 28, height: 28 }} src={this.state.avatar} />
                    <ExpandMore style={{ width: 15, height: 15 }} />
                  </Button>
                </React.Fragment>
              )
            }
          {
              !this.state.isLoggedIn && (
              <div>
                <Button
                  variant="text"
                  style={{
                    color: 'white', width: '80px', padding: '0',
                  }}
                  onClick={this.showLoginModal}
                >
                  Log In
                </Button>
                <LoginModal
                  visible={this.state.loginModalVisible}
                  onClose={this.hideLoginModal}
                  login={this.login}
                />
              </div>
              )
            }
        </React.Fragment>
      </Tooltip>
    )
  }
}
