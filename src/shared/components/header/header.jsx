// import React from "react";
import styled from "react-emotion";
import THEME from "../../theme";

export default styled("div")`
  height: ${THEME.header.height};
  background: ${THEME.header.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
