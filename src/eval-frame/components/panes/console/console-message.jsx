import React from "react";
import styled from "react-emotion";

const ConsoleMessageIcon = styled("div")`
  display: flex;
  align-items: center;
  align-self: center;
  min-width: 17px;
`;

const ConsoleMessageContainer = styled("div")`
  padding: 5px;
  padding-left: 10px;
  border-bottom: 0.5px solid gainsboro;
  display: flex;
  align-items: baseline;
  background-color: ${props => props.levelColor};

  div {
    padding-right: 5px;
  }

  li div {
    background-color: ${props => props.levelColor};
  }
`;

export default class ConsoleMessage extends React.Component {
  render() {
    return (
      <ConsoleMessageContainer levelColor={this.props.levelColor}>
        <ConsoleMessageIcon>{this.props.icon}</ConsoleMessageIcon>
        {this.props.children}
      </ConsoleMessageContainer>
    );
  }
}
