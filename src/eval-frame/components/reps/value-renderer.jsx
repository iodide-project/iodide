import React from "react";
import PropTypes from "prop-types";

import ExpandableRep from "./rep-tree";

import ErrorRenderer from "./error-handler";
import HTMLHandler from "./html-handler";
import TableRenderer from "./data-table-rep";

import { wrapValueRenderer } from "./rep-info-requestor";

import { requestRepInfo } from "./request-rep-info";

export class ValueRendererUnwrapped extends React.Component {
  static propTypes = {
    topLevelRepSummary: PropTypes.object, // eslint-disable-line
    rootObjName: PropTypes.string, // eslint-disable-line
    pathToEntity: PropTypes.array // eslint-disable-line
  };

  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { rootObjName, pathToEntity, topLevelRepSummary } = this.props;
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>A value renderer encountered an error.</h2>
          <pre>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </pre>
          <h2>Top level rep summary:</h2>
          <pre>{JSON.stringify(topLevelRepSummary)}</pre>
          <a href="https://github.com/iodide-project/iodide/issues/new">
            Please file a bug report
          </a>{" "}
          with the information above.
        </div>
      );
    }

    switch (topLevelRepSummary.repType) {
      case "HTML_STRING": {
        return <HTMLHandler htmlString={topLevelRepSummary.htmlString} />;
      }
      case "ERROR_TRACE":
        return <ErrorRenderer errorString={topLevelRepSummary.errorString} />;
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
            getChildSummaries={(name, path) =>
              requestRepInfo({
                rootObjName: name,
                pathToEntity: path,
                requestType: "CHILD_SUMMARY"
              })
            }
            rootObjName={rootObjName}
          />
        );
    }
  }
}

export default wrapValueRenderer(ValueRendererUnwrapped);
