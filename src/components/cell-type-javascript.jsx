import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import TwoRowCell from './two-row-cell'
import CellOutput from './output'
import CellEditor from './cell-editor'

import { getCellById } from '../notebook-utils'


export class JsCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.any,
    rendered: PropTypes.bool.isRequired,
  }

  render() {
    const row1 = <CellEditor cellId={this.props.cellId} />
    const row2 = (<CellOutput
      valueToRender={this.props.value}
      render={this.props.rendered}
    />)
    return (
      <TwoRowCell
        cellId={this.props.cellId}
        row1={row1}
        row2={row2}
      />
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


export default connect(mapStateToProps)(JsCellUnconnected)
