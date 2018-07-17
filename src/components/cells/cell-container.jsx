import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import Tooltip from '@material-ui/core/Tooltip'

import UnfoldLess from '@material-ui/icons/UnfoldLess'

import * as actions from '../../actions/actions'
import { getCellById } from '../../tools/notebook-utils'
import { cellTypeEnum, nextOverflow } from '../../state-prototypes'

import CellMenuContainer from './cell-menu-container'
import CellEditor from './cell-editor'

export class CellContainerUnconnected extends React.Component {
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    cellId: PropTypes.number.isRequired,
    cellType: PropTypes.oneOf(cellTypeEnum.values()),
    actions: PropTypes.shape({
      selectCell: PropTypes.func.isRequired,
    }).isRequired,
    editorOptions: PropTypes.object,
  }

  handleCellClick = () => {
    const scrollToCell = false
    if (!this.props.selected) {
      this.props.actions.selectCell(this.props.cellId, scrollToCell)
    }
  }

  handleFoldButtonClick = () => {
    this.props.actions.updateCellProperties(
      this.props.cellId,
      { inputFolding: this.props.nextInputFolding },
    )
  }

  render() {
    return (
      <div
        id={`cell-${this.props.cellId}`}
        className="cell-container"
        onMouseDown={this.handleCellClick}
        style={this.props.cellContainerStyle}
      >
        <div className="cell-header">
          <CellMenuContainer cellId={this.props.cellId} />
          <Tooltip
            classes={{ tooltip: 'iodide-tooltip' }}
            placement="bottom"
            title="fold cell"
          >
            <button className="fold-cell-button" onClick={this.handleFoldButtonClick}>
              <UnfoldLess style={{ fontSize: '12px' }} />
            </button>
          </Tooltip>
        </div>
        <div className={this.props.mainComponentClass} style={this.props.mainComponentStyle}>
          <CellEditor
            cellId={this.props.cellId}
            editorOptions={this.props.editorOptions}
          />
        </div>
      </div>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  const editingCell = (cell.selected && state.mode === 'edit')

  const cellContainerBorderWidth = (cell.selected && !editingCell) ? '2px' : '1px'
  const cellContainerBorderColor = cell.selected ? '#bbb' : '#f1f1f1'
  const cellContainerStyle = {
    outline: `solid ${cellContainerBorderColor} ${cellContainerBorderWidth}`,
  }

  const mainComponentStyle = {
    outline: `1px solid ${editingCell ? '#bbb' : '#f1f1f1'}`,
    display: cell.inputFolding === 'HIDDEN' ? 'none' : 'block',
  }
  const mainComponentClass = `main-component ${cell.inputFolding}`


  return {
    cellId: cell.id,
    cellContainerStyle,
    mainComponentStyle,
    mainComponentClass,
    selected: cell.selected,
    nextInputFolding: nextOverflow(cell.inputFolding),
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CellContainerUnconnected)
