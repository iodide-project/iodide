import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import THEME from "../../../../shared/theme";

const GutterContainer = styled("div")`
  box-sizing: content-box;
  text-align: center;
  grid-column: ${props =>
    props.side ? `${props.side}-gutter` : "left-gutter"};
  width: 30px;
  height: ${THEME.client.console.lineHeightPx}px;
  padding-top: 5px;
  padding-bottom: 5px;
`;

GutterContainer.propTypes = {
  side: PropTypes.string
};

const GutterAligner = styled("div")`
  height: ${THEME.client.console.lineHeightPx}px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default ({ children, side = "left" }) => {
  return (
    <GutterContainer side={side}>
      <GutterAligner>{children}</GutterAligner>
    </GutterContainer>
  );
};
