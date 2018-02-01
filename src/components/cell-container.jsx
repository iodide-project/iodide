
import React, {createElement} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import deepEqual from 'deep-equal'

import CellRow from './cell-row.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'


class CellContainer extends React.Component {
  /* Generic cell implements a basic cell with a code mirror editor
    in text-wrap mode (like MD or Raw), and with empty output component
    Override input/output components for different behavior
    */
  constructor(props) {
    super(props)
  }

  handleCellClick = (e) => {
    console.log("handleCellClick")
    if (this.props.viewMode === 'editor') {
      let scrollToCell = false
      if (!this.props.selected) {
        this.props.actions.selectCell(this.props.cellId, scrollToCell)
      }
    }
  }


  render() {
    return (
      <div id={'cell-' + this.props.cellId}
        className={this.props.cellClass}
        onMouseDown={this.handleCellClick}
      >
        {this.props.children}
      </div>
    )
  }
}




function mapStateToProps(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
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
let CellContainer_connected = connect(mapStateToProps, mapDispatchToProps)(CellContainer)
export {CellContainer_connected as CellContainer}

