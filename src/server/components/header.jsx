import React from "react";

import HeaderContainer from "../../shared/components/header/header";

import IodideLogo from "../../shared/iodide-logo";
import UserMenu from "../../shared/user-menu";
import LeftContainer from "../../shared/components/header/left-container";
import RightContainer from "../../shared/components/header/right-container";

class Header extends React.Component {
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
            refreshOnLoginLogout
          />
        </RightContainer>
      </HeaderContainer>
    );
  }
}

export default Header;
