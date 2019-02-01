import React from "react";
import styled, { keyframes } from "react-emotion";

import CheckCircle from "@material-ui/icons/CheckCircleOutline";
import Refresh from "@material-ui/icons/Refresh";
import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";
import ConsoleContainer from "./console-container";
import ConsoleGutter from "./console-gutter";

import BaseIcon from "./base-icon";

const MessageContainer = styled(ConsoleContainer)`
  overflow: auto;
  margin-bottom: 0px;
  margin-top: 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const MessageBody = styled("div")`
  padding: 8px;
  padding-top: 2px;
  padding-bottom: 2px;
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

const Error = BaseIcon(ErrorIcon);
const Warning = BaseIcon(WarningIcon);
const SpinningRefresh = styled(BaseIcon(Refresh))`
  animation: ${Spin} 1s ease infinite;
  opacity: 0.5;
`;

const GreenCheck = styled(BaseIcon(CheckCircle))`
  color: green;
  opacity: 0.5;
`;

levels.log.backgroundColor = "white";
levels.log.symbol = "";
levels.info.backgroundColor = "white";
levels.info.symbol = "I";
levels.warning.backgroundColor = "rgb(255,251,214)";
levels.warning.symbol = <Warning style={{ color: "rgb(190,155,0)" }} />;
levels.warning.textColor = "rgb(131, 81, 15)";
levels.error.backgroundColor = "rgb(253,244,245)";
levels.error.textColor = "rgb(164, 0, 15)";
levels.error.symbol = <Error style={{ color: "rgb(215,0,34)" }} />;

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
      <MessageContainer
        backgroundColor={levelData.backgroundColor}
        textColor={levelData.textColor || "black"}
      >
        <ConsoleGutter side="left">{levelData.symbol}</ConsoleGutter>
        <MessageBody>{this.props.children}</MessageBody>
        <ConsoleGutter side="Right">&nbsp;</ConsoleGutter>
      </MessageContainer>
    );
  }
}
