import React from "react";
import styled from "react-emotion";
import THEME from "../../../../shared/theme";

const GutterContainer = styled("div")`
  box-sizing: content-box;
  text-align: center;
  grid-column: ${props =>
    props.side ? `${props.side}-gutter` : "left-gutter"};
  width: ${THEME.client.console.lineHeightPx}px;
  height: ${THEME.client.console.lineHeightPx}px;
  padding-top: 8px;
`;

const GutterAligner = styled("div")`
  height: ${THEME.client.console.lineHeightPx}px;
  width: ${THEME.client.console.lineHeightPx}px;
  display: flex;
  align-items: middle;
  justify-content: center;
`;

export default ({ children, side }) => {
  return (
    <GutterContainer side={side}>
      <GutterAligner>{children}</GutterAligner>
    </GutterContainer>
  );
};
