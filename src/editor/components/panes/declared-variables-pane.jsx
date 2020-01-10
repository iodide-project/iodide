import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isEqual } from "lodash";
import styled from "@emotion/styled";

import { DeclaredVariable } from "./declared-variable";
import { OutlineButton } from "../../../shared/components/buttons";
import { clearVariables } from "../../actions/notebook-actions";

const DeclaredVariables = styled("div")`
  padding: 15px;
`;

const HeaderContainer = styled("div")`
  padding: 15px 15px 0px;
  display: flex;
  flex-direction: row;
  align-items: center;

  div:last-child {
    padding-left: 8px;
  }
`;

export class DeclaredVariablesPaneUnconnected extends React.Component {
  static propTypes = {
    userDefinedVarNames: PropTypes.arrayOf(PropTypes.string),
    paneVisible: PropTypes.bool.isRequired,
    clearVariables: PropTypes.func.isRequired
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
        <HeaderContainer>
          <div>
            <h3>User Defined Variables</h3>
          </div>
          <div>
            <OutlineButton onClick={this.props.clearVariables}>
              Clear
            </OutlineButton>
          </div>
        </HeaderContainer>
        <DeclaredVariables>
          {this.props.userDefinedVarNames.map(varName => (
            <DeclaredVariable varName={varName} key={varName} />
          ))}
        </DeclaredVariables>
      </div>
    );
  }
}

const mapDispatchToProps = {
  clearVariables
};

export function mapStateToProps(state) {
  return {
    userDefinedVarNames: state.userDefinedVarNames,
    paneVisible: state.panePositions.WorkspacePositioner.display === "block"
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeclaredVariablesPaneUnconnected);
