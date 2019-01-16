import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import EditorModeControls from "./editor-mode-controls";
import ViewControls from "./view-controls";
import EditorModeTitle from "./editor-mode-title";
import IodideLogo from "../../shared/iodide-logo";
import { connectionModeIsServer } from "../../tools/server-tools";
import Header from "../../shared/components/header/header";
import LeftContainer from "../../shared/components/header/left-container";
import RightContainer from "../../shared/components/header/right-container";
import MiddleContainer from "../../shared/components/header/middle-container";

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
        <Header>
          <LeftContainer>
            <IodideLogo backLink={this.props.backLink} />
            <EditorModeControls isFirstChild />
          </LeftContainer>
          <MiddleContainer>
            <EditorModeTitle />
          </MiddleContainer>
          <RightContainer>
            <ViewControls />
          </RightContainer>
        </Header>
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
