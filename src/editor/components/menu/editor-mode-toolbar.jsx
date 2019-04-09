import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import EditorModeControls from "./editor-mode-controls";
import ViewControls from "./view-controls";
import EditorModeTitle from "./editor-mode-title";
import IodideLogo from "../../../shared/components/iodide-logo";
import { connectionModeIsServer } from "../../tools/server-tools";
import Header from "../../../shared/components/header/header";
import LeftContainer from "../../../shared/components/header/left-container";
import RightContainer from "../../../shared/components/header/right-container";
import MiddleContainer from "../../../shared/components/header/middle-container";

export class EditorModeToolbarUnconnected extends React.Component {
  static propTypes = {
    viewModeStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    backLink: PropTypes.string
  };
  render() {
    return (
      <Header style={this.props.viewModeStyle}>
        <LeftContainer>
          <IodideLogo backLink={this.props.backLink} />
          <EditorModeControls />
        </LeftContainer>
        <MiddleContainer>
          <EditorModeTitle />
        </MiddleContainer>
        <RightContainer>
          <ViewControls />
        </RightContainer>
      </Header>
    );
  }
}

export function mapStateToProps(state) {
  return {
    viewModeStyle: state.viewMode === "EXPLORE_VIEW" ? {} : { display: "none" },
    backLink: connectionModeIsServer(state) && "/"
  };
}

const EditorModeToolbar = connect(mapStateToProps)(
  EditorModeToolbarUnconnected
);
export default EditorModeToolbar;
