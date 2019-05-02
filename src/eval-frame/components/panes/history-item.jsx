import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import AppMessage from "./console/app-message";
import ValueRenderer from "../reps/value-renderer";
import PreformattedTextItemsHandler from "../reps/preformatted-text-items-handler";

import HistoryInputItem from "./console/history-input-item";
import ConsoleMessage from "./console/console-message";

import { EVALUATION_RESULTS } from "../../actions/console-history-actions";

export class HistoryItemUnconnected extends React.Component {
  static propTypes = {
    content: PropTypes.string,
    level: PropTypes.string,
    historyType: PropTypes.string.isRequired,
    language: PropTypes.string,
    valueToRender: PropTypes.any // eslint-disable-line react/forbid-prop-types
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
            <ValueRenderer valueToRender={this.props.valueToRender} />
          </ConsoleMessage>
        );
      }
      case "FETCH_CELL_INFO": {
        return (
          <ConsoleMessage level={this.props.level || "OUTPUT"}>
            <PreformattedTextItemsHandler
              textItems={this.props.valueToRender}
            />
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
  return {
    content: ownProps.historyItem.content,
    historyId: ownProps.historyItem.historyId,
    historyType: ownProps.historyItem.historyType,
    level: ownProps.historyItem.level,
    language: ownProps.historyItem.language,
    valueToRender: EVALUATION_RESULTS[ownProps.historyItem.historyId]
  };
}

export default connect(mapStateToProps)(HistoryItemUnconnected);
