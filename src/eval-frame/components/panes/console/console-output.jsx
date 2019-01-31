import React from "react";
import styled from "react-emotion";
import ConsoleContainer from "./console-container";
import ConsoleGutter from "./console-gutter";
import ConsoleBody from "./console-body";

const OutputContainer = styled(ConsoleContainer)`
  margin-top: 0px;
  margin-bottom: 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

const OutputBody = styled(ConsoleBody)`
  min-height: 0px;
  display: block;
  overflow: auto;
  word-break: break-all;
  padding: 8px;
`;

const Carat = styled("span")`
  font-weight: 100;
  color: darkgray;
`;

export default class ConsoleOutput extends React.Component {
  render() {
    return (
      <OutputContainer>
        <ConsoleGutter side="left">
          <Carat> {">"}</Carat>
        </ConsoleGutter>
        <OutputBody>{this.props.children}</OutputBody>
        <ConsoleGutter side="right">&nbsp;</ConsoleGutter>
      </OutputContainer>
    );
  }
}
