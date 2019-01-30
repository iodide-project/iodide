import React from "react";
import styled from "react-emotion";
import ConsoleContainer from "./console-container";
import ConsoleGutter from "./console-gutter";

const InputContainer = styled(ConsoleContainer)`
  overflow: auto;
  margin-bottom: 5px;
  margin-top: 15px;
`;

const InputBody = styled("pre")`
  padding: 8px;
  font-family: monospace;
  background-color: #fbfbfd;
  /* border: 2px solid #d7d4f0; */
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  margin: 0;
`;

const Language = styled("div")`
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 3px;
  padding: 0px 0px 3px 3px;
  font-size: 0.8em;
`;

export default class ConsoleInput extends React.Component {
  render() {
    return (
      <InputContainer>
        <ConsoleGutter side="left" />
        <InputBody language={this.props.language}>
          {this.props.children.trim()}
        </InputBody>
        <ConsoleGutter side="right">
          <Language>{this.props.language}</Language>
        </ConsoleGutter>
      </InputContainer>
    );
  }
}
