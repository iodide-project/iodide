import React from "react";
import PropTypes from "prop-types";

import { requestRepInfo } from "./request-rep-info";

const defaultGetTopLevelRepSummary = (rootObjName, pathToEntity) =>
  requestRepInfo({
    rootObjName,
    pathToEntity,
    requestType: "TOP_LEVEL_SUMMARY"
  });

export const wrapValueRenderer = (
  WrappedValueRenderer,
  getTopLevelRepSummary = defaultGetTopLevelRepSummary,
  PlaceholderComponent = null
) => {
  return class extends React.Component {
    static propTypes = {
      windowValue: PropTypes.bool,
      valueKey: PropTypes.string.isRequired
    };

    // static defaultProps = { requestRepInfo: null };

    constructor(props) {
      super(props);
      this.state = {
        pathToEntity: [this.props.valueKey],
        rootObjName: this.props.windowValue
          ? "window"
          : "IODIDE_EVALUATION_RESULTS",
        topLevelRepSummary: null
      };
    }
    async componentDidMount() {
      const { rootObjName, pathToEntity } = this.state;
      const topLevelRepSummary = await getTopLevelRepSummary(
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
              {`The value at location "${rootObjName}" with identifier "${this.props.valueKey}" could not be retrieved.`}
            </pre>
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

      if (topLevelRepSummary !== null) {
        console.log({ topLevelRepSummary });
        return (
          <WrappedValueRenderer
            {...{ rootObjName, pathToEntity, topLevelRepSummary }}
          />
        );
      }
      return PlaceholderComponent;
    }
  };
};
