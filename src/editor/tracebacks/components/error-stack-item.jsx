import React from "react";
import PropTypes from "prop-types";

import styled from "@emotion/styled";

import { History, OpenInNew } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";

import GoToLineIcon from "./go-to-line-icon";

const TinyIconButton = styled("div")`
  color: rgba(0, 0, 0, 0.54);
  padding: 4px;
  overflow: visible;
  font-size: 1.5rem;
  text-align: center;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 50%;
  border: 0;
  margin: 0;
  cursor: pointer;
  display: inline-flex;
  outline: none;
  position: relative;
  align-items: center;
  user-select: none;
  vertical-align: middle;
  justify-content: center;
  text-decoration: none;
  background-color: transparent;
  :hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const StackItem = ({
  tracebackId,
  functionName,
  traceDisplayName,
  lineNumber,
  columnNumber,
  editedSinceEval,
  evalInUserCode,
  tracebackType,
  goToTracebackItem
}) => {
  let Icon;
  let tooltipText;
  if (tracebackType === "FETCHED_JS_SCRIPT") {
    Icon = OpenInNew;
    tooltipText = "Open script URL in new tab";
  } else if (evalInUserCode) {
    Icon = History;
    tooltipText = "Go to error in history";
  } else if (tracebackType === "USER_EVALUATION" && editedSinceEval) {
    Icon = History;
    tooltipText = "Go to error in history (code edited since evaluation)";
  } else {
    Icon = GoToLineIcon;
    tooltipText = "Go to error in editor";
  }

  const fnStr =
    functionName !== "" ? (
      <React.Fragment>
        <i>{functionName}</i> in{" "}
      </React.Fragment>
    ) : (
      ""
    );

  const colStr = columnNumber >= 0 ? ` col ${columnNumber}` : "";

  return (
    <div>
      <Tooltip classes={{ tooltip: "iodide-tooltip" }} title={tooltipText}>
        <TinyIconButton onClick={() => goToTracebackItem(tracebackId)}>
          <Icon />
        </TinyIconButton>
      </Tooltip>
      {fnStr}
      {traceDisplayName}: line {lineNumber}
      {colStr}
    </div>
  );
};

StackItem.propTypes = {
  tracebackId: PropTypes.string.isRequired,
  functionName: PropTypes.string.isRequired,
  traceDisplayName: PropTypes.string.isRequired,
  lineNumber: PropTypes.number.isRequired,
  columnNumber: PropTypes.number,
  editedSinceEval: PropTypes.bool.isRequired,
  evalInUserCode: PropTypes.bool,
  tracebackType: PropTypes.string.isRequired,
  goToTracebackItem: PropTypes.func.isRequired
};

export default StackItem;
