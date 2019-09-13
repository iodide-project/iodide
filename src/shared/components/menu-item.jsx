import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

const PADDING = 6;
const SIDE_PADDING = 12;
const MAIN_GRAY = "#e0e0e0";
const SELECTED_BACKGROUND = "#007bff";
const SELECTED_FOREGROUND = "#fff";
const MenuItemContainer = styled.li(
  props => `
  padding: ${PADDING}px ${SIDE_PADDING * 2}px ${PADDING}px ${SIDE_PADDING *
    2}px;
  min-height: 36px;
  align-self: center;
  width: calc(100% - ${SIDE_PADDING * 4}px);
  display: flex;
  align-items: center;
  font-size: 13px;

  background-color: ${props.selected && SELECTED_BACKGROUND};
  color: ${props.selected && SELECTED_FOREGROUND};

  :hover {
    background-color: ${!props.selected && MAIN_GRAY};
    cursor: pointer;
  }
`
);

export default class MenuItem extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.array
    ]),
    selected: PropTypes.bool,
    onClick: PropTypes.func
  };
  render() {
    return (
      <MenuItemContainer
        onClick={this.props.onClick}
        selected={this.props.selected}
      >
        {this.props.children}
      </MenuItemContainer>
    );
  }
}
