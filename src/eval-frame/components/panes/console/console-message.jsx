import React from "react";
import styled from "react-emotion";

import ConsoleContainer from "./console-container";
import ConsoleGutter from "./console-gutter";
import levels from "./log-levels";

const MessageContainer = styled(ConsoleContainer)`
  overflow: auto;
  margin-bottom: 0px;
  margin-top: 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const MessageBody = styled("div")`
  /* padding: 8px;
  padding-top: 2px;
  padding-bottom: 2px; */
  margin: auto;
  margin-left: 0;
`;

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
