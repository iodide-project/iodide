import React from "react";
import PropTypes from "prop-types";

import ValueRenderer from "../reps/value-renderer";

export class DeclaredVariable extends React.Component {
  static propTypes = {
    value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    varName: PropTypes.string
  };
  render() {
    return (
      <div className="declared-variable">
        <div className="declared-variable-name">{this.props.varName} = </div>
        <div className="declared-variable-value">
          <ValueRenderer valueToRender={this.props.value} />
        </div>
      </div>
    );
  }
}
