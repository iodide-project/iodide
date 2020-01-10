import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

import { WindowValueRenderer } from "../remote-reps/remote-value-renderer";

const DeclaredVariableContainer = styled("div")`
  padding-bottom: 15px;
`;

const DeclaredVariableName = styled("div")`
  font-size: 14px;
  font-family: monospace;
  background: #f9f9f9;
  border: 1px solid #f1f1f1;
  padding: 1px 10px;
  color: #000;
`;

const DeclaredVariableValue = styled("div")`
  padding-left: 20px;
  overflow-x: auto;
`;

export class DeclaredVariable extends React.Component {
  static propTypes = {
    varName: PropTypes.string
  };
  render() {
    return (
      <DeclaredVariableContainer>
        <DeclaredVariableName>{this.props.varName} = </DeclaredVariableName>
        <DeclaredVariableValue>
          <WindowValueRenderer valueKey={this.props.varName} />
        </DeclaredVariableValue>
      </DeclaredVariableContainer>
    );
  }
}
