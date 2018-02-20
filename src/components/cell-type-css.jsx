import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CellRow from './cell-row'
import { CellContainer } from './cell-container'
import CellEditor from './cell-editor'

import { getCellById } from '../notebook-utils'

export class CSSCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.any.isRequired,
    rendered: PropTypes.bool.isRequired,
  }

  render() {
    return (
      <CellContainer cellId={this.props.cellId}>
        <CellRow cellId={this.props.cellId} rowType="input">
          <CellEditor cellId={this.props.cellId} />
          <style>
            {this.props.rendered && this.props.value}
          </style>
        </CellRow>
      </CellContainer>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    cellId: cell.id,
    value: cell.value,
    rendered: cell.rendered,
  }
}

export default connect(mapStateToProps)(CSSCellUnconnected)
