import React from "react";
import styled from "react-emotion";
import THEME from "../../../../shared/theme";

const GutterContainer = styled("div")`
  box-sizing: content-box;
  text-align: center;
  grid-column: "left-gutter";
  width: 30px;
  height: ${THEME.client.console.lineHeightPx}px;
  padding-top: 5px;
  padding-bottom: 5px;
`;

const GutterAligner = styled("div")`
  height: ${THEME.client.console.lineHeightPx}px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default ({ children }) => {
  return (
    <GutterContainer>
      <GutterAligner>{children}</GutterAligner>
    </GutterContainer>
  );
};
