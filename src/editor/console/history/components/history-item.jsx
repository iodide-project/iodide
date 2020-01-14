import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

import AppMessage from "./app-message";
import { HistoryValueRenderer } from "../../../components/remote-reps/remote-value-renderer";
import ErrorStackRenderer from "../../../tracebacks/components/error-stack-renderer";

import HistoryInputItem from "./history-input-item";
import ConsoleMessage from "./console-message";
import { clearHistoryItemScroll } from "../actions";

const FetchResults = styled("pre")`
  padding: 0;
  margin: 0;
`;

export class HistoryItemUnconnected extends React.Component {
  static propTypes = {
    // historyId: PropTypes.string,
    content: PropTypes.string,
    level: PropTypes.string,
    evalId: PropTypes.string,
    historyType: PropTypes.string.isRequired,
    language: PropTypes.string,
    scrollToThisItem: PropTypes.bool,
    clearHistoryItemScroll: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.scrollTargetRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.scrollToThisItem &&
      prevProps.scrollToThisItem !== this.props.scrollToThisItem
    ) {
      console.log("scroll attempt");
      this.scrollTargetRef.current.scrollIntoView({ behavior: "smooth" });
      this.props.clearHistoryItemScroll();
    }
  }

  render() {
    let Item;
    switch (this.props.historyType) {
      case "APP_MESSAGE":
        Item = <AppMessage messageType={this.props.content} />;
        break;
      case "CONSOLE_MESSAGE": {
        // CONSOLE_MESSAGEs are non eval input / output messages.
        // examples: implicit plugin load statuses / errors, eventually browser console
        // interception.
        Item = (
          <ConsoleMessage level={this.props.level}>
            {this.props.content}
          </ConsoleMessage>
        );
        break;
      }
      case "CONSOLE_INPUT": {
        // returns an input.
        Item = (
          <HistoryInputItem language={this.props.language}>
            {this.props.content}
          </HistoryInputItem>
        );
        break;
      }
      case "CONSOLE_OUTPUT": {
        Item = (
          <ConsoleMessage level={this.props.level || "OUTPUT"}>
            <HistoryValueRenderer valueKey={this.props.evalId} />
          </ConsoleMessage>
        );
        break;
      }

      case "CONSOLE_OUTPUT_ERROR_STACK": {
        Item = (
          <ConsoleMessage level="ERROR">
            <ErrorStackRenderer evalId={this.props.evalId} />
          </ConsoleMessage>
        );
        break;
      }
      case "CONSOLE_OUTPUT_FETCH": {
        Item = (
          <ConsoleMessage level={this.props.level || "OUTPUT"}>
            <FetchResults>{this.props.content}</FetchResults>
          </ConsoleMessage>
        );
        break;
      }
      default:
        Item = (
          <ConsoleMessage level="WARN">
            Unknown history type {this.props.historyType}
          </ConsoleMessage>
        );
        break;
    }
    return <div ref={this.scrollTargetRef}>{Item}</div>;
  }
}

export function mapStateToProps(state, ownProps) {
  const historyItem = state.history.filter(
    h => h.historyId === ownProps.historyId
  )[0];
  const {
    content,
    historyType,
    level,
    language,
    evalId,
    scrollToThisItem
  } = historyItem;

  return {
    // historyId: ownProps.historyId,
    content:
      historyType === "CONSOLE_OUTPUT_FETCH" ? content.join("\n") : content,
    evalId,
    historyType,
    level,
    language,
    scrollToThisItem
  };
}

export default connect(mapStateToProps, { clearHistoryItemScroll })(
  HistoryItemUnconnected
);
