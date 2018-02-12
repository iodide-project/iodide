import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import CellRow from './cell-row'
import { CellContainer } from './cell-container'
import { getCellById } from '../notebook-utils'


export class TwoRowCellUnconnected extends React.Component {
  static propTypes = {
    cell: PropTypes.shape({
      selected: PropTypes.bool.isRequired,
      collapsePresentationViewInput: PropTypes.string,
      collapsePresentationViewOutput: PropTypes.string,
      collapseEditViewInput: PropTypes.string,
      collapseEditViewOutput: PropTypes.string,
    }).isRequired,
    cellId: PropTypes.number.isRequired,
    cellType: PropTypes.string,
    pageMode: PropTypes.oneOf(['command', 'edit']),
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    row1: PropTypes.element,
    row2: PropTypes.element,
  }

  render() {
    const { cellId, cellType } = this.props

    const cellSelected = (
      this.props.cell.selected ? 'selected-cell ' : ''
    )
    const editorMode = (
      (this.props.cell.selected && this.props.pageMode === 'edit')
        ? 'edit-mode ' : 'command-mode '
    )
    let collapseInput
    let collapseOutput
    if (this.props.viewMode === 'presentation') {
      collapseInput = this.props.cell.collapsePresentationViewInput
      collapseOutput = this.props.cell.collapsePresentationViewOutput
    } else if (this.props.viewMode === 'editor') {
      collapseInput = this.props.cell.collapseEditViewInput
      collapseOutput = this.props.cell.collapseEditViewOutput
    }
    const collapseBoth = (collapseInput === 'COLLAPSED' &&
      collapseOutput === 'COLLAPSED') ? 'collapse-both' : ''
    const cellClass = ['cell-container', cellSelected,
      editorMode, cellType, collapseBoth].join(' ')

    return (
      <CellContainer cellId={cellId} cellClass={cellClass}>
        <CellRow cellId={cellId} rowType="input">
          {this.props.row1}
        </CellRow>
        <CellRow cellId={cellId} rowType="output">
          {this.props.row2}
        </CellRow>
      </CellContainer>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    pageMode: state.mode,
    viewMode: state.viewMode,
    cell: Object.assign({}, cell),
  }
}

export default connect(mapStateToProps)(TwoRowCellUnconnected)
