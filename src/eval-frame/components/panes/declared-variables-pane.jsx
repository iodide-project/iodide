import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import deepEqual from "deep-equal";

import { DeclaredVariable } from "./declared-variable";
import { FrozenVariable } from "./frozen-variable";
import EmptyPaneContents from "./empty-pane-contents";

export class DeclaredVariablesPaneUnconnected extends React.Component {
  static propTypes = {
    userDefinedVarNames: PropTypes.arrayOf(PropTypes.string),
    // FIXME environmentVariables are deprecated at this point
    environmentVariables: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    paneVisible: PropTypes.bool.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return (
      !deepEqual(this.props, nextProps) &&
      (this.props.paneVisible || nextProps.paneVisible)
    );
  }

  render() {
    const noEnvironmentVariables = !Object.keys(this.props.environmentVariables)
      .length;
    const noDeclaredVariables = !this.props.userDefinedVarNames.length;
    const noVariables =
      noEnvironmentVariables && noDeclaredVariables ? (
        <EmptyPaneContents>No Declared Variables</EmptyPaneContents>
      ) : (
        undefined
      );
    const edvElem = !noEnvironmentVariables ? (
      <div className="declared-variables-list">
        <h3>Saved Environment</h3>
        <div className="frozen-variables">
          {Object.keys(this.props.environmentVariables).map(varName => (
            <FrozenVariable
              varName={varName}
              byteLength={this.props.environmentVariables[varName][1].length}
              key={varName}
            />
          ))}
        </div>
      </div>
    ) : (
      undefined
    );

    const declaredVariables = !noDeclaredVariables ? (
      <div className="declared-variables-list">
        <h3>User Defined Variables</h3>
        {this.props.userDefinedVarNames.map(varName => (
          <DeclaredVariable
            value={window[varName]}
            varName={varName}
            key={varName}
          />
        ))}
      </div>
    ) : (
      undefined
    );
    return (
      <div className="pane-content">
        {noVariables}
        {edvElem}
        {declaredVariables}
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    environmentVariables: state.savedEnvironment,
    userDefinedVarNames: state.userDefinedVarNames,
    paneVisible: state.panePositions.WorkspacePositioner.display === "block"
  };
}

export default connect(mapStateToProps)(DeclaredVariablesPaneUnconnected);
