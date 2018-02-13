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
    value: PropTypes.array,
    rendered: PropTypes.bool.isRequired, // not required at the moment, but will be soon.
  }

  render() {
    return (
      <TwoRowCell
        cellId={this.props.cellId}
        row1={<CellEditor cellId={this.props.cellId} />}
        row2={<ExternalResourceOutputHandler value={this.props.value} render={this.props.rendered} />}
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
