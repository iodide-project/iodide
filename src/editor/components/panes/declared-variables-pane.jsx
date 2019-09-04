import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isEqual } from "lodash";

import { DeclaredVariable } from "./declared-variable";

export class DeclaredVariablesPaneUnconnected extends React.Component {
  static propTypes = {
    userDefinedVarNames: PropTypes.arrayOf(PropTypes.string),
    paneVisible: PropTypes.bool.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(this.props, nextProps) &&
      (this.props.paneVisible || nextProps.paneVisible)
    );
  }

  render() {
    return (
      <div className="pane-content">
        <div className="declared-variables-list">
          <h3>User Defined Variables</h3>
          {this.props.userDefinedVarNames.map(varName => (
            <DeclaredVariable varName={varName} key={varName} />
          ))}
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    userDefinedVarNames: state.userDefinedVarNames,
    paneVisible: state.panePositions.WorkspacePositioner.display === "block"
  };
}

export default connect(mapStateToProps)(DeclaredVariablesPaneUnconnected);
