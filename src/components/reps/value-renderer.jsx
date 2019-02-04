import React from "react";
import PropTypes from "prop-types";

import DefaultRenderer from "./default-handler";
import ErrorRenderer from "./error-handler";
import HTMLHandler from "./html-handler";

export class ValueRenderer extends React.Component {
  static propTypes = {
    valueToRender: PropTypes.any
  };

  render() {
    if (this.props.valueToRender instanceof Error) {
      return <ErrorRenderer error={this.props.valueToRender} />;
    } else if (
      this.props.valueToRender &&
      this.props.valueToRender.iodideRender instanceof Function
    ) {
      return (
        <HTMLHandler htmlString={this.props.valueToRender.iodideRender()} />
      );
    }
    return <DefaultRenderer value={this.props.valueToRender} />;
  }
}
