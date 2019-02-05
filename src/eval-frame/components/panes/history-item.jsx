import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ValueRenderer from "../../../components/reps/value-renderer";
import PreformattedTextItemsHandler from "../../../components/reps/preformatted-text-items-handler";

import EvalInput from "./console/eval-input";
import EvalOutput from "./console/eval-output";
import ConsoleMessage from "./console/console-message";
import AppMessage from "./console/app-message";

import PluginLoadingMessage from "./console/plugin-loading-message";

import { postMessageToEditor } from "../../port-to-editor";
import { EVALUATION_RESULTS } from "../../actions/actions";

export class HistoryItemUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number,
    historyId: PropTypes.number.isRequired,
    historyType: PropTypes.string.isRequired,
    lastRan: PropTypes.number.isRequired,
    additionalArguments: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.showEditorCell = this.showEditorCell.bind(this);
  }

  showEditorCell() {
    postMessageToEditor("CLICK_ON_OUTPUT", {
      id: this.props.cellId,
      autoScrollToCell: true
    });
  }

  render() {
    switch (this.props.historyType) {
      case "PLUGIN_STATUS": {
        return (
          <PluginLoadingMessage
            loadStatus={this.props.additionalArguments.status}
          >
            {this.props.content}
          </PluginLoadingMessage>
        );
      }
      case "CONSOLE_MESSAGE": {
        return (
          <ConsoleMessage level={this.props.additionalArguments.level}>
            {this.props.content}
          </ConsoleMessage>
        );
      }
      case "CONSOLE_INPUT": {
        // returns a code input.
        return (
          <EvalInput language={this.props.additionalArguments.language}>
            {this.props.content}
          </EvalInput>
        );
      }
      case "CONSOLE_OUTPUT": {
        return (
          <EvalOutput level={this.props.level}>
            <ValueRenderer valueToRender={this.props.valueToRender} />
          </EvalOutput>
        );
      }
      case "APP_MESSAGE": {
        return <AppMessage messageType={this.props.content} />;
      }
      case "FETCH_CELL_INFO":
        return (
          <EvalOutput level={this.props.level}>
            <PreformattedTextItemsHandler
              textItems={this.props.valueToRender}
            />
          </EvalOutput>
        );
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
    cellId: ownProps.historyItem.cellId,
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
