import React from "react";
import PropTypes from "prop-types";

import DefaultRenderer from "./default-handler";
import ErrorRenderer from "./error-handler";
import HTMLHandler from "./html-handler";
import UserReps from "./user-reps-manager";

export default class ValueRenderer extends React.Component {
  static propTypes = {
    valueToRender: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const value = this.props.valueToRender;

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

    const htmlString = UserReps.getUserRepIfAvailable(value);
    if (htmlString) {
      return <HTMLHandler htmlString={htmlString} />;
    }
    if (value && value.iodideRender instanceof Function) {
      return <HTMLHandler htmlString={value.iodideRender()} />;
    }
    if (value instanceof Error) {
      return <ErrorRenderer error={value} />;
    }

    return <DefaultRenderer value={value} />;
  }
}
