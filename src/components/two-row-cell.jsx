import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CellRow from './cell-row.jsx'
import CellEditor from './cell-editor.jsx'
import {CellContainer} from './cell-container.jsx'

import {getCellById} from '../notebook-utils.js'


export class TwoRowCell_unconnected extends React.Component {
  render() {
    let cellId = this.props.cellId
    let cellType = this.props.cell.cellType

    let cellSelected = (
      this.props.cell.selected ? 'selected-cell ' : ''
    )
    let editorMode = (
      (this.props.cell.selected && this.props.pageMode === 'edit')
        ? 'edit-mode ' : 'command-mode '
    )
    let collapseInput, collapseOutput
    if (this.props.viewMode === 'presentation') {
      collapseInput = this.props.cell.collapsePresentationViewInput
      collapseOutput = this.props.cell.collapsePresentationViewOutput
    } else if (this.props.viewMode === 'editor') {
      collapseInput = this.props.cell.collapseEditViewInput
      collapseOutput = this.props.cell.collapseEditViewOutput
    }
    let collapseBoth = (collapseInput === 'COLLAPSED' &&
            collapseOutput === 'COLLAPSED') ? 'collapse-both' : ''
    let cellClass = ['cell-container', cellSelected,
      editorMode, cellType, collapseBoth].join(' ')

    return (
      <CellContainer cellId={cellId} cellClass={cellClass}>
        <CellRow cellId={cellId} rowType={'input'}>
            {this.props.row1}
        </CellRow>
        <CellRow cellId={cellId} rowType={'output'}>
            {this.props.row2}
        </CellRow>
      </CellContainer>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    pageMode: state.mode,
    viewMode: state.viewMode,
    cell: Object.assign({}, cell),
  }
}

export default connect(mapStateToProps)(TwoRowCell_unconnected)
