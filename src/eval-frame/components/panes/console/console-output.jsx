import React from "react";
import styled from "react-emotion";
import ConsoleContainer from "./console-container";
import ConsoleGutter from "./console-gutter";
import ConsoleBody from "./console-body";

const OutputContainer = styled(ConsoleContainer)`
  margin-top: 0px;
  padding-left: 8px;
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
        <ConsoleBody>{this.props.children}</ConsoleBody>
        <ConsoleGutter side="right">&nbsp;</ConsoleGutter>
      </OutputContainer>
    );
  }
}
