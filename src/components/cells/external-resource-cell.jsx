import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CellRow from './cell-row'
import { CellContainer } from './cell-container'
import CellEditor from './cell-editor'
import ExternalResourceOutputHandler from '../reps/output-handler-external-resource'

import { getCellById } from '../../tools/notebook-utils'

export class ExternalResourceCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.array,
  }

  render() {
    return (
      <CellContainer cellId={this.props.cellId}>
        <CellRow cellId={this.props.cellId} rowType="input">
          <CellEditor cellId={this.props.cellId} />
        </CellRow>
        <CellRow cellId={this.props.cellId} rowType="output">
          <ExternalResourceOutputHandler value={this.props.value} />
        </CellRow>
      </CellContainer>
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
