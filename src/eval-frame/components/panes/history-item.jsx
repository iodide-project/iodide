import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ValueRenderer from "../../../components/reps/value-renderer";
import PreformattedTextItemsHandler from "../../../components/reps/preformatted-text-items-handler";

import EvalInput from "./console/eval-input";
import EvalOutput from "./console/eval-output";
import ConsoleMessage from "./console/console-message";
import AppMessage from "./console/app-message";

import { EVALUATION_RESULTS } from "../../actions/actions";

export class HistoryItemUnconnected extends React.Component {
  static propTypes = {
    level: PropTypes.string,
    historyId: PropTypes.number.isRequired,
    historyType: PropTypes.string.isRequired,
    lastRan: PropTypes.number.isRequired,
    additionalArguments: PropTypes.object
  };

  render() {
    switch (this.props.historyType) {
      case "CONSOLE_MESSAGE": {
        // console messages are non eval input / output messages.
        // examples: implicit plugin load statuses / errors, eventually browser console
        // interception.
        return (
          <ConsoleMessage level={this.props.additionalArguments.level}>
            {this.props.content}
          </ConsoleMessage>
        );
      }
      case "CONSOLE_INPUT": {
        // returns an input.
        return (
          <EvalInput language={this.props.additionalArguments.language}>
            {this.props.content}
          </EvalInput>
        );
      }
      case "CONSOLE_OUTPUT":
      case "FETCH_CELL_INFO": {
        // returns an output associated with an input.
        return (
          <EvalOutput level={this.props.level}>
            {this.props.historyType === "FETCH_CELL_INFO" ? (
              <PreformattedTextItemsHandler
                textItems={this.props.valueToRender}
              />
            ) : (
              <ValueRenderer valueToRender={this.props.valueToRender} />
            )}
          </EvalOutput>
        );
      }
      case "APP_MESSAGE": {
        return <AppMessage messageType={this.props.content} />;
      }
      default:
        // TODO: Use better class for inline error
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
    lastRan: ownProps.historyItem.lastRan,
    level: ownProps.historyItem.additionalArguments
      ? ownProps.historyItem.additionalArguments.level
      : undefined,
    additionalArguments: ownProps.historyItem.additionalArguments,
    valueToRender: EVALUATION_RESULTS[ownProps.historyItem.historyId]
  };
}

export default connect(mapStateToProps)(HistoryItemUnconnected);
