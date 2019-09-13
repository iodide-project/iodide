import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import Avatar from "@material-ui/core/Avatar";
import ExpandMore from "@material-ui/icons/ExpandMore";

import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

import LoginModal from "./login-modal";
import Menu from "./menu";
import MenuItem from "./menu-item";
import MenuDivider from "./menu-divider";
import Popover from "./popover";
import { logoutFromServer, loginToServer } from "../utils/login";

const AvatarButtonContainer = styled("div")`
  align-items: center;
  display: inline-flex;
  color: white;
`;

export default class UserMenu extends React.Component {
  static propTypes = {
    username: PropTypes.string,
    loginCallback: PropTypes.func,
    logoutCallback: PropTypes.func,
    avatar: PropTypes.string,
    isAuthenticated: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    placement: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      loginModalVisible: false
    };

    this.goToProfile = this.goToProfile.bind(this);
    this.goToDocs = this.goToDocs.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.showLoginModal = this.showLoginModal.bind(this);
    this.hideLoginModal = this.hideLoginModal.bind(this);
  }

  goToProfile() {
    window.open(`/${this.props.username}`);
    this.handleMenuClose();
  }

  goToDocs() {
    window.open("https://docs.iodide.io/");
    this.handleMenuClose();
  }

  hideLoginModal() {
    this.setState({ loginModalVisible: false });
  }

  showLoginModal() {
    this.setState({ loginModalVisible: true });
  }

  login() {
    // if a login callback is specified, then delegate the log
    // functionality to that. otherwise handle it ourselves
    // internally in a simplified way (essentially just reloading
    // the page on success)
    if (this.props.loginCallback) {
      this.props.loginCallback();
    } else {
      loginToServer(() => window.location.reload());
    }
  }

  // FIXME: we should handle the logout failure case somehow (e.g. by popping up a notification)
  logout() {
    if (this.props.logoutCallback) {
      this.props.logoutCallback();
    } else {
      logoutFromServer(
        () => window.location.reload(),
        response => console.error("Logout unsuccessful", response)
      );
    }
  }

  render() {
    const { avatar } = this.props;
    return (
      <Tooltip title="Menu">
        <React.Fragment>
          {this.props.isAuthenticated && (
            <div style={{ marginRight: "20px" }}>
              <Popover
                title={
                  <AvatarButtonContainer>
                    <Avatar style={{ width: 28, height: 28 }} src={avatar} />
                    <ExpandMore style={{ width: 15, height: 15 }} />
                  </AvatarButtonContainer>
                }
                placement={this.props.placement || "bottom-start"}
              >
                <Menu>
                  <MenuItem onClick={this.goToProfile}>Your Profile</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={this.goToDocs}>Docs</MenuItem>
                  {!process.env.USE_OPENIDC_AUTH && (
                    <MenuItem onClick={this.logout}>Log Out</MenuItem>
                  )}
                </Menu>
              </Popover>
            </div>
          )}
          {!this.props.isAuthenticated && (
            <div>
              <Button
                variant="text"
                style={{
                  color: "white",
                  width: "80px",
                  padding: "0"
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
          )}
        </React.Fragment>
      </Tooltip>
    );
  }
}

function mapStateToProps(state) {
  const isAuthenticated = Boolean(state.userData.name);
  return {
    isAuthenticated,
    avatar: state.userData.avatar
  };
}

connect(mapStateToProps)(UserMenu);
