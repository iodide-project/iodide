import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ViewModeToggleButton from "./view-mode-toggle-button";

export class PresentationModeToolbarUnconnected extends React.Component {
  static propTypes = {
    display: PropTypes.string.isRequired
  };

  render() {
    return (
      <div
        className="presentation-menu"
        style={{ display: this.props.display }}
      >
        <div className="presentation-header">
          <div className="view-mode-toggle-from-presentation">
            <ViewModeToggleButton />
          </div>
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state) {
  const isReportView = state.viewMode === "REPORT_VIEW";
  return {
    display: isReportView ? "block" : "none"
  };
}

export default connect(mapStateToProps)(PresentationModeToolbarUnconnected);
