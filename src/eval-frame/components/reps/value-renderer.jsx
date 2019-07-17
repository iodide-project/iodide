import React from "react";
import PropTypes from "prop-types";

import ExpandableRep from "./rep-tree";

import ErrorRenderer from "./error-handler";
import HTMLHandler from "./html-handler";
import TableRenderer from "./data-table-rep";

// import { serializeForValueSummary } from "./rep-utils/value-summary-serializer";
import { getChildSummary } from "./rep-utils/get-child-summaries";
import { getTopLevelRepSummary } from "./rep-utils/get-top-level-rep-summary";

export default class ValueRenderer extends React.Component {
  static propTypes = {
    windowValue: PropTypes.bool,
    valueKey: PropTypes.string.isRequired,
    getTopLevelRepSummary: PropTypes.func
  };

  static defaultProps = {
    getTopLevelRepSummary
  };

  constructor(props) {
    super(props);
    this.state = {
      pathToEntity: [this.props.valueKey],
      rootObjName: this.props.windowValue
        ? "window"
        : "IODIDE_EVALUATION_RESULTS",
      topLevelRepSummary: undefined
    };
  }
  async componentDidMount() {
    const { rootObjName, pathToEntity } = this.state;
    const topLevelRepSummary = await this.props.getTopLevelRepSummary(
      rootObjName,
      pathToEntity
    );
    // this following lint rule is controversial. the react docs *advise*
    // loading data in compDidMount, and explicitly say calling
    // setState is ok if needed. Disabling lint rule is justified.
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ topLevelRepSummary });
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { rootObjName, pathToEntity, topLevelRepSummary } = this.state;

    if (this.state.errorInfo) {
      return (
        <div>
          <pre>
            {`The value at location "${rootObjName}" with identifier "${this.props.valueKey}" could not be loaded.`}
          </pre>
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

    if (topLevelRepSummary === undefined) {
      return "";
    }

    switch (topLevelRepSummary.repType) {
      case "HTML_STRING": {
        return <HTMLHandler htmlString={topLevelRepSummary.htmlString} />;
      }
      case "ERROR_TRACE":
        return <ErrorRenderer error={topLevelRepSummary.errorString} />;
      case "ROW_TABLE_REP":
        return (
          <TableRenderer
            initialDataRows={topLevelRepSummary.initialDataRows}
            pages={topLevelRepSummary.pages}
            pathToDataFrame={pathToEntity}
            rootObjName={rootObjName}
          />
        );
      default:
        return (
          <ExpandableRep
            pathToEntity={pathToEntity}
            valueSummary={topLevelRepSummary.valueSummary}
            getChildSummaries={getChildSummary}
            rootObjName={rootObjName}
          />
        );
    }
  }
}
