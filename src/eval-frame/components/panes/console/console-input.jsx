import React from "react";
import styled from "react-emotion";
import ConsoleContainer from "./console-container";
import ConsoleGutter from "./console-gutter";

const InputContainer = styled(ConsoleContainer)`
  overflow: auto;
  margin-bottom: 0px;
  margin-top: 3px;
`;

const InputBody = styled("pre")`
  padding: 8px;
  font-family: monospace;
  background-color: #fbfbfd;
  /* border: 2px solid #d7d4f0; */
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  margin: 0;

  :before {
    font-family: sans-serif;
    content: "${props => props.language || ""}";
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom-left-radius: 3px;
    color: rgba(0,0,0,.5);
    padding: 3px;
    padding-right:5px;
    padding-left:5px;
    font-size: 0.8em;
    float: right;
    transform: translate(9px, -9px);
  }
`;

export default class ConsoleInput extends React.Component {
  render() {
    return (
      <InputContainer>
        <ConsoleGutter side="left" />
        <InputBody language={this.props.language}>
          {this.props.children.trim()}
        </InputBody>
        <ConsoleGutter side="right">&nbsp;</ConsoleGutter>
      </InputContainer>
    );
  }
}
