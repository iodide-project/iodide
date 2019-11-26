import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { setViewMode } from "../../actions/notebook-actions";

export class ViewModeToggleButtonUnconnected extends React.Component {
  static propTypes = {
    isReportView: PropTypes.bool.isRequired,
    buttonText: PropTypes.string.isRequired,
    setViewModeToExplore: PropTypes.func.isRequired,
    setViewModeToReport: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    tooltipText: PropTypes.string.isRequired
  };
  constructor(props) {
    super(props);
    this.toggleViewMode = this.toggleViewMode.bind(this);
  }

  toggleViewMode() {
    if (this.props.isReportView) {
      this.props.setViewModeToExplore();
    } else {
      this.props.setViewModeToReport();
    }
  }

  render() {
    return (
      <Tooltip
        classes={{ tooltip: "iodide-tooltip" }}
        title={this.props.tooltipText}
      >
        <Button
          style={this.props.style}
          onClick={this.toggleViewMode}
          variant="text"
          mini
        >
          {this.props.buttonText}
        </Button>
      </Tooltip>
    );
  }
}

export function mapStateToProps(state) {
  // get the viewMode from state
  const isReportView = state.viewMode === "REPORT_VIEW";
  return {
    isReportView,
    buttonText: isReportView ? "Explore" : "View as Report",
    tooltipText: isReportView ? "Explore this notebook" : "Go to Report view",
    style: isReportView
      ? { backgroundColor: "#eee", border: "1px solid #ccc", color: "black" }
      : { color: "#fafafa" }
  };
}

const mapDispatchToProps = {
  setViewModeToReport: () => setViewMode("REPORT_VIEW"),
  setViewModeToExplore: () => setViewMode("EXPLORE_VIEW")
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewModeToggleButtonUnconnected);
