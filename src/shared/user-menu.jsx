import React from 'react'
import styled from 'react-emotion';
import Avatar from '@material-ui/core/Avatar'
import ExpandMore from '@material-ui/icons/ExpandMore'

import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'

import LoginModal from './login-modal'
import Menu from './components/menu'
import MenuItem from './components/menu-item'
import MenuDivider from './components/menu-divider'
import Popover from './components/popover'


const AvatarButtonContainer = styled('div')`
  align-items: center;
  display: inline-flex;
  color: white;
`

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: props.isAuthenticated,
      name: props.username,
      avatar: props.avatar,
      loginModalVisible: false,
    }

    this.goToProfile = this.goToProfile.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.showLoginModal = this.showLoginModal.bind(this)
    this.hideLoginModal = this.hideLoginModal.bind(this)
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
    let authWindow
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
      if (authWindow) {
        authWindow.close()
      }
    }
    if (this.props.loginCallback) {
      this.props.loginCallback(loginSuccess)
    } else {
      const url = '/oauth/login/github'
      const name = 'github_login'
      const specs = 'width=500,height=600'
      authWindow = window.open(url, name, specs)
      authWindow.focus()

      window.loginSuccess = loginSuccess

      window.loginFailure = () => {
        // do something smart here (probably pop up a notification)
        authWindow.close()
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
    return (
      <Tooltip title="Menu">
        <React.Fragment>
          {
              this.state.isLoggedIn && (
                <div style={{ marginRight: '20px' }}>
                  <Popover
                    title={
                      <AvatarButtonContainer>
                        <Avatar style={{ width: 28, height: 28 }} src={this.state.avatar} />
                        <ExpandMore style={{ width: 15, height: 15 }} />
                      </AvatarButtonContainer>
                    }
                    placement={this.props.placement || 'bottom-start'}
                  >
                    <Menu>
                      <MenuItem onClick={this.goToProfile}>
                        Go to Profile
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem onClick={this.logout}>
                        Log Out
                      </MenuItem>
                    </Menu>
                  </Popover>
                </div>
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
