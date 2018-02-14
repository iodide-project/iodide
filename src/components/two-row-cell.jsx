import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import CellRow from './cell-row'
import { CellContainer } from './cell-container'
import { getCellById } from '../notebook-utils'

export class TwoRowCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    row1: PropTypes.element,
    row2: PropTypes.element,
  }

  render() {
    return (
      <CellContainer cellId={this.props.cellId}>
        <CellRow cellId={this.props.cellId} rowType="input">
          {this.props.row1}
        </CellRow>
        <CellRow cellId={this.props.cellId} rowType="output">
          {this.props.row2}
        </CellRow>
      </CellContainer>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    cellId: cell.id,
  }
}

export default connect(mapStateToProps)(TwoRowCellUnconnected)
