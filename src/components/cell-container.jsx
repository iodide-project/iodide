
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import actions from '../actions'
import { getCellById } from '../notebook-utils'


class CellContainer extends React.Component {
  handleCellClick = () => {
    if (this.props.viewMode === 'editor') {
      const scrollToCell = false
      if (!this.props.selected) {
        this.props.actions.selectCell(this.props.cellId, scrollToCell)
      }
    }
  }

  render() {
    return (
      <div
        id={`cell-${this.props.cellId}`}
        className={this.props.cellClass}
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
    pageMode: state.mode,
    viewMode: state.viewMode,
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
