import React, {createElement} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {TwoRowCell} from './two-row-cell.jsx'
import CellOutput from './output.jsx'
import CellEditor from './cell-editor.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'



class JsCell extends React.Component {
  render() {
  return (
    <TwoRowCell
      cellId={this.props.cellId}
      row1 = {
        <CellEditor cellId={this.props.cellId} />
      }
      row2 = {
        <CellOutput
          valueToRender={this.props.value}
          renderValue={this.props.rendered} />
      }
    />
    )
  }
}



function mapStateToPropsForCells(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    value: cell.value,
    rendered: cell.rendered,
    cellId: cell.id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToPropsForCells, mapDispatchToProps)(JsCell)