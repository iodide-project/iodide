import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CellRow from './cell-row'
import { CellContainer } from './cell-container'
import { getCellById } from '../notebook-utils'


class OneRowCell extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    children: PropTypes.node,
  }
  render() {
    return (
      <CellContainer cellId={this.props.cellId}>
        <CellRow cellId={this.props.cellId} rowType="input">
          {this.props.children}
        </CellRow>
      </CellContainer>
    )
  }
}


function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    cellId: cell.id,
  }
}

export default connect(mapStateToProps)(OneRowCell)
