import React from "react";
import styled, { keyframes } from "react-emotion";

import CheckCircle from "@material-ui/icons/CheckCircleOutline";
import Refresh from "@material-ui/icons/Refresh";

import ConsoleContainer from "./console-container";
import ConsoleGutter from "./console-gutter";

const MessageContainer = styled(ConsoleContainer)`
  overflow: auto;
  margin-bottom: 0px;
  margin-top: 0px;
  background-color: ${props => props.color || "white"};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const MessageBody = styled("div")`
  padding: 8px;
  margin: 0;
`;

export const levels = {
  log: {},
  info: {},
  warning: {},
  error: {}
};

const Spin = keyframes`
0% {
  transform: rotate(0deg);
}

100% {
  transform: rotate(360deg);
}
`;

const WIDTH = "20px";

const SpinningRefresh = styled(Refresh)`
  animation: ${Spin} 1s ease infinite;
  opacity: 0.5;
  width: ${WIDTH};
`;

const GreenCheck = styled(CheckCircle)`
  color: green;
  opacity: 0.5;
  width: ${WIDTH};
`;

levels.log.backgroundColor = "white";
levels.log.symbol = "";
levels.info.backgroundColor = "white";
levels.info.symbol = "I";
levels.warning.backgroundColor = "rgb(255,251,214)";
levels.warning.symbol = "W";
levels.error.backgroundColor = "(253,244,245)";
levels.error.symbol = "E";

levels.isLoading = {};
levels.isLoading.symbol = <SpinningRefresh />;
levels.isLoading.backgroundColor = "rgb(251,251,253)";
levels.loadingSuccess = {};
levels.loadingSuccess.symbol = <GreenCheck />;
levels.loadingSuccess.backgroundColor = "rgb(251,251,253)";

export default class ConsoleMessage extends React.Component {
  render() {
    const levelData = levels[this.props.level];
    return (
      <MessageContainer>
        <ConsoleGutter side="left">{levelData.symbol}</ConsoleGutter>
        <MessageBody>{this.props.children}</MessageBody>
        <ConsoleGutter side="Right">&nbsp;</ConsoleGutter>
      </MessageContainer>
    );
  }
}
