import React from "react";
import PropTypes from "prop-types";

import { WindowValueRenderer } from "../remote-reps/remote-value-renderer";

export class DeclaredVariable extends React.Component {
  static propTypes = {
    varName: PropTypes.string
  };
  render() {
    return (
      <div className="declared-variable">
        <div className="declared-variable-name">{this.props.varName} = </div>
        <div className="declared-variable-value">
          <WindowValueRenderer valueKey={this.props.varName} />
        </div>
      </div>
    );
  }
}
