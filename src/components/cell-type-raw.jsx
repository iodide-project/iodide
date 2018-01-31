import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CellEditor from './cell-editor.jsx'
import OneRowCell from './one-row-cell.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'


class RawCell extends React.Component {
  render() {
    return (
      <OneRowCell cellId={this.props.cellId}>
        <CellEditor
          cellId={this.props.cellId}
          editorOptions = {{
            matchBrackets: false,
            autoCloseBrackets: false,
          }}
        />
      </OneRowCell>
    )
  }
}


function mapStateToProps(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    cellId: cell.id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RawCell)