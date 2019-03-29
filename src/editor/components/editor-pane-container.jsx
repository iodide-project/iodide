import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import deepEqual from "deep-equal";

import JsmdEditor from "./jsmd-editor";
import FixedPositionContainer from "../../shared/components/fixed-position-container";

import LayoutManager from "./pane-layout/layout-manager";

class EditorPaneContainer extends React.Component {
  static propTypes = {
    hideEditor: PropTypes.bool.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }

  render() {
    return (
      <React.Fragment>
        <LayoutManager />
        <FixedPositionContainer
          paneId="EditorPositioner"
          hidden={this.props.hideEditor}
        >
          <JsmdEditor />
        </FixedPositionContainer>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    hideEditor: state.viewMode === "REPORT_VIEW"
  };
}

export default connect(mapStateToProps)(EditorPaneContainer);
