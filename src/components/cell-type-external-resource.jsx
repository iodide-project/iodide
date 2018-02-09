import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TwoRowCell from './two-row-cell'
import CellEditor from './cell-editor'
import ExternalResourceOutputHandler from './output-handler-external-resource'

import { getCellById } from '../notebook-utils'

export class ExternalResourceCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
  }

  render() {
    return (
      <TwoRowCell
        cellId={this.props.cellId}
        row1={<CellEditor cellId={this.props.cellId} />}
        row2={<ExternalResourceOutputHandler cellId={this.props.cellId} />}
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
