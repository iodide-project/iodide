import React from "react";
import PropTypes from "prop-types";

import DefaultRenderer from "./default-handler";
import ErrorRenderer from "./error-handler";
import HTMLHandler from "./html-handler";
import TableRenderer from "./data-table-rep";
import UserReps from "./user-reps-manager";
import { isRowDf } from "./rep-utils/rep-type-chooser";

function repChooser(value) {
  if (UserReps.getUserRepIfAvailable(value)) {
    return "GLOBAL_USER_RENDERER";
  }
  if (value && value.iodideRender instanceof Function) {
    return "OBJECT_USER_RENDER_METHOD";
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
    const repType = repChooser(value);
    console.log("repType ......................", repType);
    switch (repType) {
      case "GLOBAL_USER_RENDERER": {
        const htmlString = UserReps.getUserRepIfAvailable(value);
        return <HTMLHandler htmlString={htmlString} />;
      }
      case "OBJECT_USER_RENDER_METHOD":
        return <HTMLHandler htmlString={value.iodideRender()} />;
      case "ERROR_REP":
        return <ErrorRenderer error={value} />;
      case "TABLE_REP":
        console.log("-------------------- table rep");
        return <TableRenderer value={value} />;
      default:
        return <DefaultRenderer value={value} />;
    }
  }
}
