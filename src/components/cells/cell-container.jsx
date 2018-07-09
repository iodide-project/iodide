import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import Tooltip from 'material-ui/Tooltip'

import UnfoldLess from 'material-ui-icons/UnfoldLess'

import * as actions from '../../actions/actions'
import { getCellById } from '../../tools/notebook-utils'
import { cellTypeEnum } from '../../state-prototypes'

import CellMenuContainer from './cell-menu-container'
import CellRow from './cell-row'
import CellEditor from './cell-editor'


export class CellContainerUnconnected extends React.Component {
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    cellId: PropTypes.number.isRequired,
    editingCell: PropTypes.bool.isRequired,
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

  render() {
    const cellClass = `cell-container ${
      this.props.cellType
    }${
      this.props.selected ? ' selected-cell' : ''
    }${
      this.props.editingCell ? ' editing-cell' : ''
    }`

    return (
      <div
        id={`cell-${this.props.cellId}`}
        className={cellClass}
        onMouseDown={this.handleCellClick}
      >
        <div className="cell-header">
          <CellMenuContainer cellId={this.props.cellId} />
          <Tooltip
            classes={{ tooltip: 'iodide-tooltip' }}
            placement="bottom"
            title="fold cell"
          >
            <button className="fold-cell-button" onClick={() => { /* FILL THIS OUT */ }}>
              <UnfoldLess style={{ fontSize: '12px' }} />
            </button>
          </Tooltip>
        </div>
        <div className="cell-row-container">
          <CellRow cellId={this.props.cellId} rowType="input">
            <CellEditor
              cellId={this.props.cellId}
              editorOptions={this.props.editorOptions}
            />
          </CellRow>
        </div>
      </div>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    cellId: cell.id,
    selected: cell.selected,
    editingCell: cell.selected && state.mode === 'edit',
    cellType: cell.cellType,
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CellContainerUnconnected)
