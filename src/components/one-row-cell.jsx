import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CellRow from './cell-row'
import { CellContainer } from './cell-container'

import actions from '../actions'
import { getCellById } from '../notebook-utils'


class OneRowCell extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    cellType: PropTypes.string,
    pageMode: PropTypes.oneOf(['command', 'edit']),
    children: PropTypes.element,
    cellSelected: PropTypes.bool.isRequired,
  }
  render() {
    const { cellId, cellType } = this.props

    const cellSelected = (
      this.props.cellSelected ? 'selected-cell ' : ''
    )
    const editorMode = (
      (this.props.cellSelected && this.props.pageMode === 'edit')
        ? 'edit-mode ' : 'command-mode '
    )

    const cellClass = ['cell-container', cellSelected,
      editorMode, cellType].join(' ')

    return (
      <CellContainer cellId={cellId} cellClass={cellClass}>
        <CellRow cellId={cellId} rowType="input">
          {this.props.children}
        </CellRow>
      </CellContainer>
    )
  }
}


function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    pageMode: state.mode,
    // viewMode: state.viewMode,
    cellSelected: cell.selected,
    cellType: cell.cellType,
    // cell: Object.assign({}, cell),
    cellId: cell.id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OneRowCell)
