import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import THEME from "../../shared/theme";

const UserNameContainer = styled("a")`
  display: flex;
  align-items: center;
  padding-right: 8px;
  padding-bottom: 0px;

  img {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    margin: 0px;
    margin-right: 8px;
  }

  div {
    font-weight: bold;
  }
`;

const Avatar = ({ src }) => (
  <img src={`${src}&s=${THEME.defaultUserIconSize}`} alt={src} />
);

Avatar.propTypes = {
  src: PropTypes.string.isRequired
};

// appropriate for inline displays, tables, etc.
export class SmallUserName extends React.Component {
  render() {
    return (
      <UserNameContainer href={`/${this.props.username}/`}>
        <div>
          <Avatar src={this.props.avatar} />
        </div>
      </UserNameContainer>
    );
  }
}

SmallUserName.propTypes = {
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired
};

const MediumUserNameContainer = styled("a")`
  display: block;
  text-decoration: none;
  color: black;

  :hover {
    text-decoration: underline;
  }

  div.info-table {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  div.user-name {
    font-size: 14px;
  }

  img {
    border-radius: 7px;
    margin-right: 15px;
  }
`;

export class MediumUserName extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    fullName: PropTypes.string
  };
  render() {
    return (
      <MediumUserNameContainer href={`/${this.props.username}`}>
        <div className="info-table">
          <img src={this.props.avatar} alt={this.props.username} width={35} />
          <div className="user-name">
            {this.props.fullName} <i>({this.props.username})</i>
          </div>
        </div>
      </MediumUserNameContainer>
    );
  }
}
