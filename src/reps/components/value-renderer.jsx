import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import DOMPurify from "dompurify";

import ExpandableRep from "./rep-tree";
import TableRenderer from "./data-table-rep";

import {
  TopLevelRepSummaryPropTypes,
  PathToEntityPropTypes
} from "./rep-serialization-core-types-proptypes";

export const ErrorPrintout = styled("pre")`
  margin: 0;
`;

const purifyHtml = html =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "div",
      "span",
      "ol",
      "ul",
      "li",
      "table",
      "thead",
      "tbody",
      "th",
      "tr",
      "td",
      "pre"
    ],
    ALLOWED_ATTR: ["style", "class"]
  });

export class ValueRendererUnconnected extends React.Component {
  static propTypes = {
    topLevelRepSummary: TopLevelRepSummaryPropTypes,
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
    const { pathToEntity, topLevelRepSummary } = this.props;
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
        const html = purifyHtml(topLevelRepSummary.htmlString);
        return (
          <div
            title="htmlRep"
            dangerouslySetInnerHTML={{ __html: html }} // eslint-disable-line react/no-danger
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
            requestRepInfo={this.props.requestRepInfo}
          />
        );
      default:
        return (
          <ExpandableRep
            pathToEntity={pathToEntity}
            valueSummary={topLevelRepSummary.valueSummary}
            getChildSummaries={path =>
              this.props.requestRepInfo({
                pathToEntity: path,
                requestType: "CHILD_SUMMARY"
              })
            }
          />
        );
    }
  }
}
