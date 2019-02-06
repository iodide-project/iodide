import React from "react";

import PropTypes from "prop-types";
import styled from "react-emotion";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import BaseIcon from "./base-icon";
import ConsoleContainer from "./console-container";
import ConsoleGutter from "./console-gutter";
import ConsoleBody from "./console-body";
import levels from "./log-levels";

const ArrowBack = styled(BaseIcon(ArrowBackIcon))`
  opacity: 0.5;
`;

const OutputContainer = styled(ConsoleContainer)`
  overflow: auto;
  margin-top: 0px;
  margin-bottom: 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const OutputBody = styled(ConsoleBody)`
  min-height: 20px;
  display: grid;
  word-break: break-all;
  padding: 5px 0px 5px 0px;
`;

export function mapProps(level) {
  const GutterIcon = level !== undefined ? levels[level].symbol : <ArrowBack />;
  const backgroundColor = levels[level]
    ? levels[level].backgroundColor
    : "white";
  const textColor = levels[level] ? levels[level].textColor : "black";
  return { icon: GutterIcon, backgroundColor, textColor };
}

const EvalOutput = ({ level, children }) => {
  const props = mapProps(level);
  return (
    <OutputContainer
      backgroundColor={props.backgroundColor}
      textColor={props.textColor}
    >
      <ConsoleGutter>{props.icon}</ConsoleGutter>
      <OutputBody>{children}</OutputBody>
    </OutputContainer>
  );
};

EvalOutput.propTypes = {
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  icon: PropTypes.element
};

export default EvalOutput;
