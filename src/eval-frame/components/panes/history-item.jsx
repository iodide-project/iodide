import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ValueRenderer from "../../../components/reps/value-renderer";
import PreformattedTextItemsHandler from "../../../components/reps/preformatted-text-items-handler";

import ConsoleInput from "./console/console-input";
import ConsoleOutput from "./console/console-output";
import ConsoleMessage from "./console/console-message";
import AppMessage from "./console/app-message";

import PluginLoadingMessage from "./console/plugin-loading-message";

// import PaneContentButton from "./pane-content-button";
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
    let output;
    let showCellReturnButton = true;
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
          <ConsoleInput language={this.props.additionalArguments.language}>
            {this.props.content}
          </ConsoleInput>
        );
      }
      case "CONSOLE_OUTPUT": {
        return (
          <ConsoleOutput level={this.props.level}>
            <ValueRenderer render valueToRender={this.props.valueToRender} />
          </ConsoleOutput>
        );
      }
      case "APP_MESSAGE": {
        return <AppMessage>{this.props.content}</AppMessage>;
      }
      case "CELL_EVAL_VALUE":
        output = <ValueRenderer valueToRender={this.props.valueToRender} />;
        break;
      case "CELL_EVAL_INFO":
        output = this.props.valueToRender;
        break;
      case "CONSOLE_EVAL":
        output = <ValueRenderer valueToRender={this.props.valueToRender} />;
        showCellReturnButton = false;
        break;
      case "FETCH_CELL_INFO":
        return (
          <ConsoleOutput level={this.props.level}>
            <PreformattedTextItemsHandler
              textItems={this.props.valueToRender}
            />
          </ConsoleOutput>
        );
      default:
        // TODO: Use better class for inline error
        output = <div>Unknown history type {this.props.historyType}</div>;
        break;
    }

    const cellReturnButton = showCellReturnButton ? (
      <div className="history-metadata-positioner">
        <div className="history-metadata">
          <div className="history-show-actual-cell">
            {/* <PaneContentButton
              text="scroll to cell"
              onClick={this.showEditorCell}
            >
              <ArrowBack style={{ fontSize: "12px" }} />
            </PaneContentButton> */}
          </div>
          {/* <div className="history-time-since"> {this.state.timeSince} </div> */}
        </div>
      </div>
    ) : (
      ""
    );

    return (
      <div
        id={`history-item-id-${this.props.historyId}`}
        className="history-cell"
      >
        <div className="history-content editor">
          {cellReturnButton}
          <pre className="history-item-code">{this.props.content}</pre>
        </div>
        <div className="history-item-output">{output}</div>
      </div>
    );
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
