import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types';

import actions from '../actions'
import { getCellById } from '../notebook-utils'


class CellContainer extends React.Component {
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    cellId: PropTypes.number.isRequired,
    children: PropTypes.node,
    pageMode: PropTypes.oneOf(['command', 'edit', 'title-edit']),
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    actions: PropTypes.shape({
      selectCell: PropTypes.func.isRequired,
    }).isRequired,
  }

  handleCellClick = () => {
    if (this.props.viewMode === 'editor') {
      const scrollToCell = false
      if (!this.props.selected) {
        this.props.actions.selectCell(this.props.cellId, scrollToCell)
      }
    }
  }

  render() {
    const cellClass = `cell-container ${
      this.props.cellType === 'code' ? this.props.language : this.props.cellType
    } ${
      this.props.selected ? 'selected-cell' : ''
    } ${
      (this.props.selected && this.props.pageMode === 'edit') ?
        'edit-mode ' : 'command-mode '
    }`

    return (
      <div
        id={`cell-${this.props.cellId}`}
        className={cellClass}
        onMouseDown={this.handleCellClick}
      >
        {this.props.children}
      </div>
    )
  }
}


function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    cellId: cell.id,
    selected: cell.selected,
    pageMode: state.mode,
    viewMode: state.viewMode,
    cellType: cell.cellType,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Page)
const CellContainerConnected = connect(mapStateToProps, mapDispatchToProps)(CellContainer)
export { CellContainerConnected as CellContainer }
