import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CellRow from './cell-row'
import { CellContainer } from './cell-container'
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
    return (
      <CellContainer cellId={this.props.cellId}>
        <CellRow cellId={this.props.cellId} rowType="input">
          <CellEditor cellId={this.props.cellId} />
        </CellRow>
        <CellRow cellId={this.props.cellId} rowType="output">
          <CellOutput
            valueToRender={this.props.value}
            render={this.props.rendered}
          />
        </CellRow>
      </CellContainer>
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
