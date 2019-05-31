import React from "react";
import PropTypes from "prop-types";

// import DefaultRenderer from "./default-handler";
import ExpandableRep from "./rep-tree";

import ErrorRenderer from "./error-handler";
import HTMLHandler from "./html-handler";
import TableRenderer from "./data-table-rep";
import UserReps from "./user-reps-manager";

import { isRowDf } from "./rep-utils/rep-type-chooser";
import { serializeForValueSummary } from "./rep-utils/value-summary-serializer";
import { getChildSummary } from "./rep-utils/get-child-summaries";

import { IODIDE_EVALUATION_RESULTS } from "../../iodide-evaluation-results";

function repChooser(value) {
  if (UserReps.getUserRepIfAvailable(value)) {
    return "USER_REGISTERED_RENDERER";
  }
  if (value && value.iodideRender instanceof Function) {
    return "IODIDERENDER_METHOD_ON_OBJECT";
  }
  if (value instanceof Error) {
    return "ERROR_REP";
  }
  if (isRowDf(value)) {
    return "TABLE_REP";
  }
  return "DEFAULT_REP";
}

export default class ValueRenderer extends React.Component {
  static propTypes = {
    windowValue: PropTypes.bool,
    valueKey: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { valueKey, windowValue } = this.props;

    const value = windowValue
      ? window[valueKey]
      : IODIDE_EVALUATION_RESULTS[valueKey];

    if (this.state.errorInfo) {
      return (
        <div>
          <pre>{value.toString()}</pre>
          <h2>A value renderer encountered an error.</h2>
          <pre>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </pre>
          <a href="https://github.com/iodide-project/iodide/issues/new">
            Please file a bug report.
          </a>
        </div>
      );
    }
    const repType = repChooser(value);
    switch (repType) {
      case "USER_REGISTERED_RENDERER": {
        const htmlString = UserReps.getUserRepIfAvailable(value);
        return <HTMLHandler htmlString={htmlString} />;
      }
      case "IODIDERENDER_METHOD_ON_OBJECT":
        return <HTMLHandler htmlString={value.iodideRender()} />;
      case "ERROR_REP":
        return <ErrorRenderer error={value} />;
      case "TABLE_REP":
        return (
          <TableRenderer
            value={value}
            pathToEntity={[valueKey]}
            rootObjName={windowValue ? "window" : "IODIDE_EVALUATION_RESULTS"}
          />
        );
      default:
        return (
          <ExpandableRep
            pathToEntity={[valueKey]}
            valueSummary={serializeForValueSummary(value)}
            getChildSummaries={getChildSummary}
            rootObjName={windowValue ? "window" : "IODIDE_EVALUATION_RESULTS"}
          />
        );
    }
  }
}
