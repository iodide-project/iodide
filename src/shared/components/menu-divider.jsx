import React from "react";
import styled from "@emotion/styled";

const MAIN_GRAY = "#e0e0e0";
const MenuDividerContainer = styled("li")`
  align-self: center;
  width: 100%;
  height: 0px;
  border-bottom: 1px solid ${MAIN_GRAY};
`;

export default class MenuDivider extends React.Component {
  render() {
    return <MenuDividerContainer />;
  }
}
