import React from "react";
import styled from "@emotion/styled";
import THEME from "../../theme";

const IodideLogoMarkContainer = styled("svg")`
  margin: auto;
  display: block;
`;
export default () => (
  <IodideLogoMarkContainer
    width="100"
    viewBox="0 0 386 386"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="15"
      y="15"
      width="356"
      height="356"
      rx="30"
      fill="white"
      stroke={THEME.logo.darkColor} // #4f3554"
      strokeWidth="30"
      strokeMiterlimit="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M240.6 326H141.4V294.4H173V97.6H141.4V66H240.6V97.6H209.4V294.4H240.6V326Z"
      fill={THEME.logo.darkColor}
    />
    <line
      x1="265"
      y1="112.5"
      x2="329"
      y2="112.5"
      stroke={THEME.logo.darkColor}
      strokeWidth="27"
      strokeLinejoin="round"
    />
  </IodideLogoMarkContainer>
);
