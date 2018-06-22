import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CellRow from './cell-row';
import { CellContainer } from './cell-container';
import CellOutput from './cell-output';
import CellEditor from './cell-editor';

export class CodeCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
  }

  render() {
    // console.log(`CodeCellUnconnected rendered: ${this.props.cellId}`)
    return (
      <CellContainer cellId={this.props.cellId}>
        <CellRow cellId={this.props.cellId} rowType="input">
          <CellEditor cellId={this.props.cellId} />
        </CellRow>
        <CellRow cellId={this.props.cellId} rowType="sideeffect">
          <div id={`cell-${this.props.cellId}-side-effect-target`} className="side-effect-target" />
        </CellRow>
        <CellRow cellId={this.props.cellId} rowType="output">
          <CellOutput cellId={this.props.cellId} />
        </CellRow>
      </CellContainer>
    );
  }
}

export default connect()(CodeCellUnconnected);
