import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CellRow from './cell-row'
import { CellContainer } from './cell-container'

export class RawCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
  }
  render() {
    return (
      <CellContainer cellId={this.props.cellId}>
        <CellRow cellId={this.props.cellId} rowType="output">
          raw cell
        </CellRow>
      </CellContainer>
    )
  }
}

export default connect()(RawCellUnconnected)
