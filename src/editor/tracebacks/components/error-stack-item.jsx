import React from "react";
import { connect, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import styled from "@emotion/styled";

import { History, OpenInNew } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import { openScriptInNewTab, scrollToHistoryItemByEvalId } from "../thunks";
import { setErrorInEditor } from "../../actions/editor-actions";

import { getChunkStartLineInEditorByEvalId } from "../../console/history/selectors";

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

const iconForErrorType = errorType => {
  const Icon = {
    OPEN_SCRIPT: OpenInNew,
    SHOW_IN_EDITOR: GoToLineIcon,
    SHOW_IN_HISTORY: History
  }[errorType];
  return Icon || History;
};

const StackItemUnconnected = ({
  goToErrorType,
  tooltipText,
  functionName,
  traceDisplayName,
  lineNumber,
  columnNumber,
  onClickFn
}) => {
  const dispatch = useDispatch();
  const Icon = iconForErrorType(goToErrorType);

  const functionNameNode =
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
        <TinyIconButton onClick={() => dispatch(onClickFn())}>
          <Icon />
        </TinyIconButton>
      </Tooltip>
      {functionNameNode}
      {traceDisplayName}: line {lineNumber}
      {colStr}
    </div>
  );
};

StackItemUnconnected.propTypes = {
  goToErrorType: PropTypes.oneOf([
    "OPEN_SCRIPT",
    "SHOW_IN_EDITOR",
    "SHOW_IN_HISTORY"
  ]),
  tooltipText: PropTypes.string.isRequired,
  functionName: PropTypes.string.isRequired,
  traceDisplayName: PropTypes.string.isRequired,
  columnNumber: PropTypes.number.isRequired,
  lineNumber: PropTypes.number.isRequired,
  onClickFn: PropTypes.func.isRequired
};

export function mapStateToProps(state, ownProps) {
  const {
    functionName,
    jsScriptTagBlobId,
    lineNumber,
    columnNumber,
    evalInUserCode
  } = ownProps.stackItem;

  let traceDisplayName;
  let finalLineNumber = lineNumber;
  let tooltipText;
  let goToErrorType;
  let onClickFn;

  if (jsScriptTagBlobId.slice(0, 4) === "http") {
    // FIXME testing based on the start of this string is brittle
    // should explicitly capture remote script load status
    traceDisplayName = jsScriptTagBlobId.split("/").pop();
    tooltipText = "Open script URL in new tab";
    goToErrorType = "OPEN_SCRIPT";
    onClickFn = () => openScriptInNewTab(jsScriptTagBlobId);
  } else {
    const userEval = evalInUserCode ? " (within eval)" : "";
    traceDisplayName = `[${jsScriptTagBlobId}${userEval}]`;

    if (evalInUserCode) {
      // always show in the history if there error is inside
      // an `eval` statement in the user's code
      tooltipText = "Go to error in history";
      goToErrorType = "SHOW_IN_HISTORY";
      onClickFn = () => scrollToHistoryItemByEvalId(jsScriptTagBlobId);
    } else {
      const startLine = getChunkStartLineInEditorByEvalId(
        state,
        jsScriptTagBlobId
      );
      if (startLine !== undefined) {
        // the original chunk has NOT been edited
        finalLineNumber = lineNumber + startLine;
        tooltipText = "Go to error in editor";
        goToErrorType = "SHOW_IN_EDITOR";
        onClickFn = () => setErrorInEditor(finalLineNumber, columnNumber);
      } else {
        // the original chunk has been edited
        tooltipText = "Go to error in history (code edited since evaluation)";
        goToErrorType = "SHOW_IN_HISTORY";
        onClickFn = () => scrollToHistoryItemByEvalId(jsScriptTagBlobId);
      }
    }
  }

  return {
    functionName,
    goToErrorType,
    tooltipText,
    traceDisplayName,
    lineNumber: finalLineNumber,
    columnNumber,
    onClickFn
  };
}

export default connect(mapStateToProps)(StackItemUnconnected);
