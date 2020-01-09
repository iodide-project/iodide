import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import StackItem from "./error-stack-item";

// import styled from "@emotion/styled";

// const MessageBody = styled("div")`
//   margin: auto;
//   margin-left: 0;
//   padding-top: 5px;
//   padding-bottom: 5px;
//   min-height: 20px;
//   max-width: calc(100% - 5px);
//   overflow-x: hidden;
// `;

const keyFromStackItem = stackItem => {
  const {
    functionName,
    tracebackId,
    lineNumber,
    columnNumber,
    evalInUserCode
  } = stackItem;
  return `${tracebackId}-${functionName}-${lineNumber}-${columnNumber}-${evalInUserCode}`;
};

const ErrorStackRendererUnconnected = ({ message, name, stack }) => {
  return (
    <React.Fragment>
      <pre>
        {name}: {message}
      </pre>
      {stack.map(stackItem => (
        <StackItem {...stackItem} key={keyFromStackItem(stackItem)} />
      ))}
    </React.Fragment>
  );
};

ErrorStackRendererUnconnected.propTypes = {
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  stack: PropTypes.arrayOf(PropTypes.object)
};

export function mapStateToProps(state, ownProps) {
  const { evalId } = ownProps;
  const errorStack = state.tracebackInfo.evalErrorStacks[evalId];
  return errorStack;
}

export default connect(mapStateToProps)(ErrorStackRendererUnconnected);
