import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import TwoRowCell from './two-row-cell'
import CellEditor from './cell-editor'
import ExternalResourceOutputHandler from './output-handler-external-resource'

import { getCellById } from '../notebook-utils'

export class ExternalResourceCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.array,
  }

  render() {
    return (
      <TwoRowCell
        cellId={this.props.cellId}
        row1={<CellEditor cellId={this.props.cellId} />}
        row2={<ExternalResourceOutputHandler value={this.props.value} />}
      />
    )
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    value: cell.value,
    cellId: cell.id,
  }
}

export default connect(mapStateToProps)(ExternalResourceCellUnconnected)
