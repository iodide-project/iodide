import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CellEditor from './cell-editor'
import OneRowCell from './one-row-cell'

import { getCellById } from '../notebook-utils'

export class CSSCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.any.isRequired,
    rendered: PropTypes.bool.isRequired,
  }

  render() {
    return (
      <OneRowCell cellId={this.props.cellId}>
        <CellEditor cellId={this.props.cellId} />
        <style>
          {this.props.rendered && this.props.value}
        </style>
      </OneRowCell>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    value: cell.value,
    rendered: cell.rendered,
  }
}

export default connect(mapStateToProps)(CSSCellUnconnected)
