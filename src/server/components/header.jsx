import React from "react";
import PropTypes from "prop-types";
import HeaderContainer from "../../shared/components/header/header";

import IodideLogo from "../../shared/components/iodide-logo";
import UserMenu from "../../shared/components/user-menu";
import LeftContainer from "../../shared/components/header/left-container";
import RightContainer from "../../shared/components/header/right-container";

export default class Header extends React.Component {
  static propTypes = {
    userInfo: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string
    })
  };
  render() {
    return (
      <HeaderContainer>
        <LeftContainer>
          <IodideLogo target="_self" backLink="/" />
        </LeftContainer>
        <RightContainer>
          <UserMenu
            isAuthenticated={this.props.userInfo && this.props.userInfo.name}
            username={this.props.userInfo.name}
            avatar={this.props.userInfo.avatar}
          />
        </RightContainer>
      </HeaderContainer>
    );
  }
}
