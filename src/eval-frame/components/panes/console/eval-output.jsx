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
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

const OutputBody = styled(ConsoleBody)`
  min-height: 20px;
  display: grid;
  word-break: break-all;
  padding: 5px 0px 5px 0px;
`;

export default class ConsoleOutput extends React.Component {
  static propTypes = {
    level: PropTypes.string
  };
  render() {
    // FIXME: this needs to all move out of the direct logic of this component
    // or tests need to be written.
    const GutterIcon =
      this.props.level && this.props.level === "error" ? (
        levels.error.symbol
      ) : (
        <ArrowBack />
      );
    const backgroundColor = levels[this.props.level]
      ? levels[this.props.level].backgroundColor
      : "white";
    const textColor = levels[this.props.level]
      ? levels[this.props.level].textColor
      : "black";
    return (
      <OutputContainer backgroundColor={backgroundColor} textColor={textColor}>
        <ConsoleGutter side="left">{GutterIcon}</ConsoleGutter>
        <OutputBody>{this.props.children}</OutputBody>
        <ConsoleGutter side="right">&nbsp;</ConsoleGutter>
      </OutputContainer>
    );
  }
}
