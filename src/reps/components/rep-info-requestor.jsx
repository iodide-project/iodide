import React from "react";
import PropTypes from "prop-types";

export const makeValueRendererWithRepRequest = (
  WrappedValueRenderer,
  requestRepInfo,
  rootObjName,
  PlaceholderComponent = null
) => {
  function requestRepInfoFromRootObj(requestObj) {
    return requestRepInfo(Object.assign({ rootObjName }, requestObj));
  }
  return class extends React.Component {
    static propTypes = {
      windowValue: PropTypes.bool,
      valueKey: PropTypes.string.isRequired
    };

    constructor(props) {
      super(props);
      this.state = {
        pathToEntity: [this.props.valueKey],
        topLevelRepSummary: null
      };
    }
    async componentDidMount() {
      const { pathToEntity } = this.state;
      const topLevelRepSummary = await requestRepInfo({
        rootObjName,
        pathToEntity,
        requestType: "TOP_LEVEL_SUMMARY"
      });

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
      const { pathToEntity, topLevelRepSummary } = this.state;

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
        return (
          <WrappedValueRenderer
            {...{
              pathToEntity,
              topLevelRepSummary,
              requestRepInfo: requestRepInfoFromRootObj
            }}
          />
        );
      }
      return PlaceholderComponent;
    }
  };
};
