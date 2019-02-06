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

  render() {
    const value = this.props.valueToRender;
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
