import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Toolbar from "@material-ui/core/Toolbar";
import EditorModeControls from "./editor-mode-controls";
import ViewControls from "./view-controls";
import EditorModeTitle from "./editor-mode-title";
import IodideLogo from "../../shared/iodide-logo";
import { connectionModeIsServer } from "../../tools/server-tools";

export class EditorModeToolbarUnconnected extends React.Component {
  static propTypes = {
    viewMode: PropTypes.string
  };
  render() {
    return (
      <div
        className="notebook-toolbar-container"
        style={{
          display: this.props.viewMode === "EXPLORE_VIEW" ? "block" : "none"
        }}
      >
        <Toolbar classes={{ root: "notebook-toolbar" }}>
          <IodideLogo backLink={this.props.backLink} />
          <EditorModeControls isFirstChild />
          <EditorModeTitle />
          <ViewControls />
        </Toolbar>
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    viewMode: state.viewMode,
    backLink: connectionModeIsServer(state) && "/"
  };
}

const EditorModeToolbar = connect(mapStateToProps)(
  EditorModeToolbarUnconnected
);
export default EditorModeToolbar;
