import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

const MenuContainer = styled("ul")`
  list-style-type: none;
  margin: 0;
  padding: 0;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

export default class Menu extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.array
    ])
  };
  render() {
    return <MenuContainer>{this.props.children}</MenuContainer>;
  }
}
