import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

import AppMessage from "./app-message";
import { HistoryValueRenderer } from "../../../components/remote-reps/remote-value-renderer";

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
    historyId: PropTypes.string.isRequired,
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
            <HistoryValueRenderer valueKey={this.props.historyId} />
          </ConsoleMessage>
        );
      }
      case "FETCH_CELL_INFO": {
        return (
          <ConsoleMessage level={this.props.level || "OUTPUT"}>
            <FetchResults>{this.props.content}</FetchResults>
          </ConsoleMessage>
        );
      }
      default:
        return (
          <ConsoleMessage level="warn">
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
  const { content, historyId, historyType, level, language } = historyItem;

  return {
    content: historyType === "FETCH_CELL_INFO" ? content.join("\n") : content,
    historyId,
    historyType,
    level,
    language
  };
}

export default connect(mapStateToProps)(HistoryItemUnconnected);
