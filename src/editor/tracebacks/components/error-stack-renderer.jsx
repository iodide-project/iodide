import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "@emotion/styled";

import StackItem from "./error-stack-item";
import { getHistoryInputByEvalId } from "../../console/history/selectors";
import { getTracebackItemById } from "../selectors";
import { goToTracebackItem } from "../thunks";

const ErrorStackWrapper = styled("pre")`
  margin: 0;
`;

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

export const ErrorStackRendererUnconnected = ({
  message,
  name,
  stack,
  goToTracebackItemDispatch
}) => {
  return (
    <ErrorStackWrapper>
      {name}: {message}
      {"\n"}
      {stack.map(stackItem => (
        <StackItem
          goToTracebackItem={goToTracebackItemDispatch}
          {...stackItem}
        />
      ))}
    </ErrorStackWrapper>
  );
};

ErrorStackRendererUnconnected.propTypes = {
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  stack: PropTypes.arrayOf(PropTypes.object),
  goToTracebackItemDispatch: PropTypes.func.isRequired
};

function coalesceStackItem(state, stackItem) {
  const {
    functionName,
    tracebackId,
    lineNumber,
    columnNumber,
    evalInUserCode
  } = stackItem;
  const tracebackItem = getTracebackItemById(state, tracebackId);

  let traceDisplayName;
  let finalLineNumber = lineNumber;
  let editedSinceEval = false;

  if (tracebackItem.tracebackType === "USER_EVALUATION") {
    const { evalId, originalChunkId } = getHistoryInputByEvalId(
      state,
      tracebackItem.evalId
    );

    const userEval = evalInUserCode ? " (within eval)" : "";
    traceDisplayName = `[${evalId}${userEval}]`;

    if (!evalInUserCode) {
      const originalChunkArray = state.iomdChunks.filter(
        chunk => chunk.chunkId === originalChunkId
      );
      const startLine =
        originalChunkArray.length > 0 ? originalChunkArray[0].startLine : 0;
      finalLineNumber = lineNumber + startLine;
      // if the original chunk can't be found, it has been edited
      editedSinceEval = originalChunkArray.length === 0;
    }
  } else {
    traceDisplayName = tracebackItem.fileName;
  }

  return {
    tracebackId,
    traceDisplayName,
    functionName,
    lineNumber: finalLineNumber,
    columnNumber,
    editedSinceEval,
    evalInUserCode,
    tracebackType: tracebackItem.tracebackType,
    key: keyFromStackItem(stackItem)
  };
}

export function mapStateToProps(state, ownProps) {
  const { evalId } = ownProps;
  const { name, message, stack } = state.tracebackInfo.evalErrorStacks[evalId];
  return {
    name,
    message,
    stack: stack.map(item => coalesceStackItem(state, item))
  };
}

const mapDispatchToProps = { goToTracebackItemDispatch: goToTracebackItem };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorStackRendererUnconnected);
