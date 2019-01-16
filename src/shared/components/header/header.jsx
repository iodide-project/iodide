// import React from "react";
import styled from "react-emotion";
import THEME from "../../theme";

export default styled("div")`
  height: ${THEME.header.height};
  background: ${THEME.header.background};
  display: grid;
  grid-template-columns: [left-start] auto [left-end middle-start] 1fr [middle-end right-start] auto [right-end];
  justify-content: space-between;
  align-items: center;
`;
