import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ReportPane from "./panes/report-pane";
import DeclaredVariablesPane from "./panes/declared-variables-pane";
import ConsolePane from "./panes/console-pane";

import FixedPositionContainer from "../../shared/components/fixed-position-container";

export class EvalContainerUnconnected extends React.Component {
  static propTypes = {
    reportOnly: PropTypes.bool.isRequired
  };

  render() {
    const { reportOnly } = this.props;
    return (
      <React.Fragment>
        <FixedPositionContainer
          paneId="ReportPositioner"
          fullscreen={reportOnly}
        >
          <ReportPane />
        </FixedPositionContainer>

        <FixedPositionContainer paneId="ConsolePositioner" hidden={reportOnly}>
          <ConsolePane />
        </FixedPositionContainer>

        <FixedPositionContainer
          paneId="WorkspacePositioner"
          hidden={reportOnly}
        >
          <DeclaredVariablesPane />
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

export default connect(mapStateToProps)(EvalContainerUnconnected);
