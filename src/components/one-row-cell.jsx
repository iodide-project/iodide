import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CellRow from './cell-row.jsx'
import CellEditor from './cell-editor.jsx'
import {CellContainer} from './cell-container.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'


class OneRowCell extends React.Component {
  render() {
    let cellId = this.props.cellId
    let cellType = this.props.cellType

    let cellSelected = (
      this.props.cellSelected ? 'selected-cell ' : ''
    )
    let editorMode = (
      (this.props.cellSelected && this.props.pageMode === 'edit')
        ? 'edit-mode ' : 'command-mode '
    )

    let cellClass = ['cell-container', cellSelected,
      editorMode, cellType].join(' ')

    return (
      <CellContainer cellId={cellId} cellClass={cellClass}>
        <CellRow cellId={cellId} rowType={'input'}>
            {this.props.children}
        </CellRow>
      </CellContainer>
    )
  }
}


function mapStateToProps(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
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