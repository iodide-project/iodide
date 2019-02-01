import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DoubleChevron from "./double-chevron-icon";
import BaseIcon from "./console/base-icon";

import {
  // updateConsoleText, consoleHistoryStepBack,
  evalConsoleInput
} from "../../actions/actions";
import { postActionToEditor } from "../../port-to-editor";

const DoubleChevronIcon = BaseIcon(DoubleChevron);

export function getTextAreaPosition(textArea) {
  return {
    currentLine: textArea.value.substr(0, textArea.selectionStart).split("\n")
      .length,
    totalLines: textArea.value.split("\n").length
  };
}

export class ConsoleInputUnconnected extends React.Component {
  static propTypes = {
    // historyContents: PropTypes.arrayOf(PropTypes.string).isRequired,
    consoleText: PropTypes.string.isRequired,
    updateConsoleText: PropTypes.func.isRequired,
    consoleHistoryStepBack: PropTypes.func.isRequired,
    evalConsoleInput: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.textAreaRef = React.createRef();
    this.containerRef = React.createRef();
    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.resizeToFitText = this.resizeToFitText.bind(this);
    this.state = {
      consoleText: this.props.consoleText,
      prevPropsConsoleText: this.props.consoleText // eslint-disable-line react/no-unused-state
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.consoleText !== state.prevPropsConsoleText) {
      return {
        consoleText: props.consoleText,
        prevPropsConsoleText: props.consoleText,
        justEvaled: false
      };
    }
    return null;
  }

  componentDidUpdate() {
    this.resizeToFitText();
  }

  onFirstLine() {
    const { currentLine } = getTextAreaPosition(this.textAreaRef.current);
    return currentLine === 1;
  }

  onLastLine() {
    const { currentLine, totalLines } = getTextAreaPosition(
      this.textAreaRef.current
    );
    return currentLine === totalLines;
  }

  handleTextInput(event) {
    // this check is required to prevent the insertion of a newline
    // after eval b/c of a pernicious race condition between the
    // keypress and onchange events, setState, and getDerivedStateFromProps
    if (event.target.value !== "\n") {
      this.setState({ consoleText: event.target.value });
    }
  }

  resizeToFitText() {
    // snippet adapted from:
    // https://stackoverflow.com/questions/2803880/is-there-a-way-to-get-a-textarea-to-stretch-to-fit-its-content-without-using-php
    this.textAreaRef.current.style.height = "2px";
    const height = this.textAreaRef.current.scrollHeight;
    this.containerRef.current.style["min-height"] = `${height + 4}px`;
    this.containerRef.current.style["max-height"] = `${height + 4}px`;
    this.textAreaRef.current.style.height = "100%"; // `${height}px`
  }

  handleKeyDown(event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      if (event.key === "ArrowUp" && this.onFirstLine()) {
        this.props.updateConsoleText(this.textAreaRef.current.value);
        this.props.consoleHistoryStepBack(1);
      }
      if (event.key === "ArrowDown" && this.onLastLine()) {
        this.props.updateConsoleText(this.textAreaRef.current.value);
        this.props.consoleHistoryStepBack(-1);
      }
    }
    if (event.key === "Enter" && !event.shiftKey) {
      this.props.evalConsoleInput(this.textAreaRef.current.value);
      this.setState({ consoleText: "" });
    }
  }

  render() {
    return (
      <div
        ref={this.containerRef}
        className="console-text-input-container"
        style={{
          borderTop: "1px solid #ddd",
          maxHeight: "27px", // default max-height
          display: "flex"
        }}
      >
        <DoubleChevronIcon />
        <div style={{ flexGrow: 1 }}>
          <textarea
            name="text"
            spellCheck={false}
            ref={this.textAreaRef}
            onChange={this.handleTextInput}
            onKeyDown={this.handleKeyDown}
            rows="1"
            style={{
              resize: "none",
              lineHeight: "20px",
              padding: "3px 0px 0px 0px",
              height: "100%",
              width: "100%",
              border: "none",
              boxSizing: "border-box",
              outline: "none",
              margin: "0px",
              fontSize: "13px"
            }}
            value={this.state.consoleText}
          />
        </div>
      </div>
    );
  }
}

const connectMessagePassers = (WrappedComponent, messageFns) =>
  class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} {...messageFns} />;
    }
  };

export const ConsoleInputMessagePasser = connectMessagePassers(
  ConsoleInputUnconnected,
  {
    updateConsoleText: consoleText =>
      postActionToEditor({
        type: "UPDATE_CONSOLE_TEXT",
        consoleText
      }),
    consoleHistoryStepBack: consoleCursorDelta =>
      postActionToEditor({
        type: "CONSOLE_HISTORY_MOVE",
        consoleCursorDelta
      })
  }
);

export function mapStateToProps(state) {
  return {
    consoleText: state.consoleText
  };
}

function mapDispatchToProps(dispatch) {
  return {
    evalConsoleInput: consoleText => {
      dispatch(evalConsoleInput(consoleText));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConsoleInputMessagePasser);
