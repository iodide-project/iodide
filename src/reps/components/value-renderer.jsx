import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";

import ExpandableRep from "./rep-tree";
import TableRenderer from "./data-table-rep";

import {
  TopLevelRepSummaryPropTypes,
  PathToEntityPropTypes
} from "./rep-serialization-core-types-proptypes";

export const ErrorPrintout = styled("pre")`
  margin: 0;
`;

export class ValueRendererUnwrapped extends React.Component {
  static propTypes = {
    topLevelRepSummary: TopLevelRepSummaryPropTypes,
    rootObjName: PropTypes.string,
    pathToEntity: PathToEntityPropTypes,
    requestRepInfo: PropTypes.func.isRequired
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
        return (
          <div
            title="htmlRep"
            dangerouslySetInnerHTML={{ __html: topLevelRepSummary.htmlString }} // eslint-disable-line react/no-danger
          />
        );
      }
      case "ERROR_TRACE":
        return <ErrorPrintout>{topLevelRepSummary.errorString}</ErrorPrintout>;
      case "ROW_TABLE_REP":
        return (
          <TableRenderer
            initialDataRows={topLevelRepSummary.initialDataRows}
            pages={topLevelRepSummary.pages}
            pathToDataFrame={pathToEntity}
            rootObjName={rootObjName}
            requestRepInfo={this.props.requestRepInfo}
          />
        );
      default:
        return (
          <ExpandableRep
            pathToEntity={pathToEntity}
            valueSummary={topLevelRepSummary.valueSummary}
            getChildSummaries={(name, path) =>
              this.props.requestRepInfo({
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
