import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types';

import * as actions from '../../actions/actions'
import { getCellById } from '../../tools/notebook-utils'
import { cellTypeEnum } from '../../state-prototypes'

import CellMenuContainer from './cell-menu-container'


export class CellContainerUnconnected extends React.Component {
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    cellId: PropTypes.number.isRequired,
    children: PropTypes.node,
    editingCell: PropTypes.bool.isRequired,
    // pageMode: PropTypes.oneOf(['command', 'edit', 'title-edit']),
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    cellType: PropTypes.oneOf(cellTypeEnum.values()),
    actions: PropTypes.shape({
      selectCell: PropTypes.func.isRequired,
    }).isRequired,
  }

  // shouldComponentUpdate(nextProps) {
  //   return (
  //     this.props.selected !== nextProps.selected ||
  //     this.props.pageMode !== nextProps.pageMode ||
  //     this.props.cellType !== nextProps.cellType
  //   )
  // }

  handleCellClick = () => {
    if (this.props.viewMode === 'editor') {
      const scrollToCell = false
      if (!this.props.selected) {
        this.props.actions.selectCell(this.props.cellId, scrollToCell)
      }
    }
  }

  render() {
    // console.log(`CellContainer rendered: ${this.props.cellId}`)
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
        <CellMenuContainer cellId={this.props.cellId} />
        <div className="cell-row-container">
          {this.props.children}
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
    viewMode: state.viewMode,
    cellType: cell.cellType,
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Page)
const CellContainerConnected = connect(mapStateToProps, mapDispatchToProps)(CellContainerUnconnected) // eslint-disable-line
export { CellContainerConnected as CellContainer }
