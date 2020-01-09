import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// import styled from "@emotion/styled";

import { getHistoryInputByEvalId } from "../../console/history/selectors";
// const MessageBody = styled("div")`
//   margin: auto;
//   margin-left: 0;
//   padding-top: 5px;
//   padding-bottom: 5px;
//   min-height: 20px;
//   max-width: calc(100% - 5px);
//   overflow-x: hidden;
// `;

const StackItemUnconnected = ({
  functionName,
  traceDisplayName,
  lineNumber,
  columnNumber
}) => {
  const colStr = columnNumber !== undefined ? ` col ${columnNumber}` : "";
  const fnStr = functionName !== "" ? `; in ${functionName}` : "";
  return (
    <React.Fragment>
      <pre>
        {traceDisplayName}: line {lineNumber}
        {colStr}
        {fnStr}
      </pre>
    </React.Fragment>
  );
};

StackItemUnconnected.propTypes = {
  functionName: PropTypes.string.isRequired,
  traceDisplayName: PropTypes.string.isRequired,
  lineNumber: PropTypes.number.isRequired,
  columnNumber: PropTypes.number
};

export function mapStateToProps(state, ownProps) {
  const {
    functionName,
    tracebackId,
    lineNumber,
    columnNumber,
    evalInUserCode
  } = ownProps;
  const tracebackItem = state.tracebackInfo.tracebackItems[tracebackId];

  let traceDisplayName;
  let finalLineNumber = lineNumber;
  let hasBeenEdited;

  if (tracebackItem.tracebackType === "USER_EVALUATION") {
    const {
      evalId,
      originalChunkId,
      editedSinceEval
    } = getHistoryInputByEvalId(state, tracebackItem.evalId);

    const userEval = evalInUserCode ? " (within eval)" : "";
    traceDisplayName = `[${evalId}${userEval}]`;

    if (!evalInUserCode) {
      const originalChunkArray = state.iomdChunks.filter(
        chunk => chunk.chunkId === originalChunkId
      );
      const startLine =
        originalChunkArray.length > 0 ? originalChunkArray[0].startLine : 0;
      finalLineNumber = lineNumber + startLine;
    }
    hasBeenEdited = editedSinceEval;
  } else {
    traceDisplayName = tracebackItem.fileName;
  }

  return {
    traceDisplayName,
    functionName,
    lineNumber: finalLineNumber,
    columnNumber,
    hasBeenEdited
  };
}

export default connect(mapStateToProps)(StackItemUnconnected);
