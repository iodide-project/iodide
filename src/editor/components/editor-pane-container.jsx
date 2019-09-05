import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isEqual } from "lodash";

import IomdEditor from "./iomd-editor/iomd-editor";
import DeclaredVariablesPane from "./panes/declared-variables-pane";
import ConsolePane from "../console/console-pane";

import FixedPositionContainer from "../../shared/components/fixed-position-container";

import LayoutManager from "./pane-layout/layout-manager";

class EditorPaneContainer extends React.Component {
  static propTypes = {
    reportOnly: PropTypes.bool.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render() {
    return (
      <React.Fragment>
        <LayoutManager />
        <FixedPositionContainer
          paneId="EditorPositioner"
          hidden={this.props.reportOnly}
        >
          <IomdEditor />
        </FixedPositionContainer>

        <FixedPositionContainer
          paneId="WorkspacePositioner"
          hidden={this.props.reportOnly}
        >
          <DeclaredVariablesPane />
        </FixedPositionContainer>

        <FixedPositionContainer
          paneId="ConsolePositioner"
          hidden={this.props.reportOnly}
        >
          <ConsolePane />
        </FixedPositionContainer>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    reportOnly: state.viewMode === "REPORT_VIEW"
  };
}

export default connect(mapStateToProps)(EditorPaneContainer);
