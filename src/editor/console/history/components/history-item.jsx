import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

import AppMessage from "./app-message";
import { HistoryValueRenderer } from "../../../components/remote-reps/remote-value-renderer";
import ErrorStackRenderer from "../../../tracebacks/components/error-stack-renderer";

import HistoryInputItem from "./history-input-item";
import ConsoleMessage from "./console-message";

const FetchResults = styled("pre")`
  padding: 0;
  margin: 0;
`;

export class HistoryItemUnconnected extends React.Component {
  static propTypes = {
    content: PropTypes.string,
    level: PropTypes.string,
    evalId: PropTypes.string,
    historyType: PropTypes.string.isRequired,
    language: PropTypes.string
  };

  render() {
    switch (this.props.historyType) {
      case "APP_MESSAGE":
        return <AppMessage messageType={this.props.content} />;
      case "CONSOLE_MESSAGE": {
        // CONSOLE_MESSAGEs are non eval input / output messages.
        // examples: implicit plugin load statuses / errors, eventually browser console
        // interception.
        return (
          <ConsoleMessage level={this.props.level}>
            {this.props.content}
          </ConsoleMessage>
        );
      }
      case "CONSOLE_INPUT": {
        // returns an input.
        return (
          <HistoryInputItem language={this.props.language}>
            {this.props.content}
          </HistoryInputItem>
        );
      }
      case "CONSOLE_OUTPUT": {
        return (
          <ConsoleMessage level={this.props.level || "OUTPUT"}>
            <HistoryValueRenderer valueKey={this.props.evalId} />
          </ConsoleMessage>
        );
      }
      case "CONSOLE_OUTPUT_ERROR_STACK": {
        return (
          <ConsoleMessage level="ERROR">
            <ErrorStackRenderer evalId={this.props.evalId} />
          </ConsoleMessage>
        );
      }
      case "CONSOLE_OUTPUT_FETCH": {
        return (
          <ConsoleMessage level={this.props.level || "OUTPUT"}>
            <FetchResults>{this.props.content}</FetchResults>
          </ConsoleMessage>
        );
      }
      default:
        return (
          <ConsoleMessage level="WARN">
            Unknown history type {this.props.historyType}
          </ConsoleMessage>
        );
    }
  }
}

export function mapStateToProps(state, ownProps) {
  const historyItem = state.history.filter(
    h => h.historyId === ownProps.historyId
  )[0];
  const { content, historyType, level, language, evalId } = historyItem;

  return {
    content:
      historyType === "CONSOLE_OUTPUT_FETCH" ? content.join("\n") : content,
    evalId,
    historyType,
    level,
    language
  };
}

export default connect(mapStateToProps)(HistoryItemUnconnected);
