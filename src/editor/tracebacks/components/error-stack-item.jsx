import React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import styled from "@emotion/styled";

import { History, OpenInNew } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import { openScriptInNewTab, scrollToHistoryItemByEvalId } from "../thunks";
import { setErrorInEditor } from "../../actions/editor-actions";
import { envConnect } from "../../env-connect";

import { getChunkStartLineInEditorByEvalId } from "../../console/history/selectors";

import GoToLineIcon from "./go-to-line-icon";

const InlineIconWrapper = styled("div")`
  color: rgba(0, 0, 0, 0.54);
  padding: 0px 6px 2px 6px;
  overflow: visible;
  border-radius: 50%;
  border: 0;
  margin: 0;
  cursor: pointer;
  display: inline-flex;
  outline: none;
  vertical-align: middle;
  justify-content: center;
`;

const GoToErrorLink = styled("a")`
  color: rgba(0, 0, 238);
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const iconForErrorType = errorType => {
  const Icon = {
    OPEN_SCRIPT: OpenInNew,
    SHOW_IN_EDITOR: GoToLineIcon,
    SHOW_IN_HISTORY: History,
    USER_EVAL: History
  }[errorType];
  return Icon || History;
};

const tooltipForErrorType = errorType => {
  const tooltip = {
    OPEN_SCRIPT: "Open script URL in new tab",
    SHOW_IN_EDITOR: "Go to error in editor",
    SHOW_IN_HISTORY: "Go to error in history (code edited since run)",
    USER_EVAL: "Show eval code in user in history"
  }[errorType];
  return tooltip || "Go to error in history";
};

export const StackItemUnconnected = ({
  goToErrorType,
  // tooltipText,
  functionName,
  traceDisplayName,
  lineNumber,
  columnNumber,
  onClickFn
}) => {
  const dispatch = useDispatch();
  const Icon = iconForErrorType(goToErrorType);
  const tooltipText = tooltipForErrorType(goToErrorType);

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
      {functionNameNode}
      <Tooltip classes={{ tooltip: "iodide-tooltip" }} title={tooltipText}>
        <span onClick={() => dispatch(onClickFn())}>
          <GoToErrorLink>
            {traceDisplayName}: line {lineNumber}
            {colStr}
            <InlineIconWrapper>
              <Icon fontSize="small" />
            </InlineIconWrapper>
          </GoToErrorLink>
        </span>
      </Tooltip>
    </div>
  );
};

StackItemUnconnected.propTypes = {
  goToErrorType: PropTypes.oneOf([
    "OPEN_SCRIPT",
    "SHOW_IN_EDITOR",
    "SHOW_IN_HISTORY",
    "USER_EVAL"
  ]),
  // tooltipText: PropTypes.string.isRequired,
  functionName: PropTypes.string.isRequired,
  traceDisplayName: PropTypes.string.isRequired,
  columnNumber: PropTypes.number.isRequired,
  lineNumber: PropTypes.number.isRequired,
  onClickFn: PropTypes.func.isRequired
};

if (process.env.STORYBOOK_MODE === "true") {
  const onClickFn = x => console.log(x);
  StackItemUnconnected.storyPropsList = [
    {
      functionName: "foo",
      traceDisplayName: "lodash.js",
      lineNumber: 3,
      columnNumber: 6,
      goToErrorType: "OPEN_SCRIPT",
      onClickFn,
      key: "1"
    },
    {
      functionName: "bar",
      traceDisplayName: "[input-5-js]",
      lineNumber: 33,
      columnNumber: 46,
      goToErrorType: "SHOW_IN_EDITOR",
      onClickFn,
      key: "2"
    },
    {
      functionName: "baradfd",
      traceDisplayName: "[input-3-js]",
      lineNumber: 21,
      columnNumber: 4,
      goToErrorType: "SHOW_IN_HISTORY",
      onClickFn,
      key: "3"
    },
    {
      functionName: "",
      traceDisplayName: "[input-8-js]",
      lineNumber: 2,
      columnNumber: 14,
      goToErrorType: "SHOW_IN_EDITOR",
      onClickFn,
      key: "4"
    }
  ];
}

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
    goToErrorType = "OPEN_SCRIPT";
    onClickFn = () => openScriptInNewTab(jsScriptTagBlobId);
  } else {
    const userEval = evalInUserCode ? " (within eval)" : "";
    traceDisplayName = `[${jsScriptTagBlobId}${userEval}]`;

    if (evalInUserCode) {
      // always show in the history if there error is inside
      // an `eval` statement in the user's code
      goToErrorType = "USER_EVAL";
      onClickFn = () => scrollToHistoryItemByEvalId(jsScriptTagBlobId);
    } else {
      const startLine = getChunkStartLineInEditorByEvalId(
        state,
        jsScriptTagBlobId
      );
      if (startLine !== undefined) {
        // the original chunk has NOT been edited
        finalLineNumber = lineNumber + startLine;
        goToErrorType = "SHOW_IN_EDITOR";
        onClickFn = () => setErrorInEditor(finalLineNumber, columnNumber);
      } else {
        // the original chunk has been edited
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

export default envConnect(mapStateToProps)(StackItemUnconnected);
