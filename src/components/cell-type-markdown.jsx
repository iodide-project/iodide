import React, {createElement} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {TwoRowCell} from './two-row-cell.jsx'
import CellOutput from './output.jsx'
import CellEditor from './cell-editor.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'



class MarkdownCell extends React.Component {

  enterEditMode = () => {
    if (this.props.viewMode === 'editor') {
      if (this.props.pageMode !== 'edit') {
        this.props.actions.changeMode('edit')
      }
      this.props.actions.markCellNotRendered()
    }
  }

  render() {
    let resultDisplayStyle,editorDisplayStyle
    if (this.props.rendered &&
          !(this.props.cellSelected &&
            this.props.pageMode == 'edit')){
      resultDisplayStyle = 'block'
      editorDisplayStyle = 'none'
    } else {
      resultDisplayStyle = 'none'
      editorDisplayStyle = 'block'
    }

    return (
      <TwoRowCell
        cellId={this.props.id}
        row1 = {
          <CellEditor
            cellId={this.props.id}
            containerStyle={{display: editorDisplayStyle}}
            onContainerClick={this.enterEditMode}
            editorOptions = {{
              lineWrapping: true,
              matchBrackets: false,
              autoCloseBrackets: false,
              lineNumbers: false,
            }}
          />
        }
        row2 = {
          <div
            onDoubleClick={this.enterEditMode}
            style={{display: resultDisplayStyle}}
            dangerouslySetInnerHTML={{__html: this.props.value}}
          />
        }
      />
    )
  }

}



function mapStateToProps(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    value: cell.value,
    rendered: cell.rendered,
    id: cell.id,
    cellSelected: cell.selected,
    pageMode: state.mode,
    viewMode: state.viewMode,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarkdownCell)
