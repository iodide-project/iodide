import React from "react";
import styled from "react-emotion";

const PADDING = 6;
const SIDE_PADDING = 12;
const MAIN_GRAY = "#e0e0e0";
const MenuItemContainer = styled("li")`
  padding: ${PADDING}px ${SIDE_PADDING * 2}px ${PADDING}px ${SIDE_PADDING * 2}px;
  min-height: 36px;
  align-self: center;
  width: calc(100% - ${SIDE_PADDING * 4}px);
  display: flex;
  align-items: center;
  font-size: 13px;

  :hover {
    background-color: ${MAIN_GRAY};
  }
`;

export default class MenuItem extends React.Component {
  render() {
    return (
      <MenuItemContainer onClick={this.props.onClick}>
        {this.props.children}
      </MenuItemContainer>
    );
  }
}
