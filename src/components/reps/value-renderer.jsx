import React from "react";
import PropTypes from "prop-types";

import DefaultRenderer from "./default-handler";
import ErrorRenderer from "./error-handler";

export class ValueRenderer extends React.Component {
  static propTypes = {
    valueToRender: PropTypes.any
  };

  render() {
    if (this.props.valueToRender instanceof Error) {
      return <ErrorRenderer error={this.props.valueToRender} />;
    }
    return <DefaultRenderer value={this.props.valueToRender} />;
  }
}
