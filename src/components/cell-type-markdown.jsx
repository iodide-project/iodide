import React, {createElement} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'

import TwoRowCell from './two-row-cell.jsx'
import CellOutput from './output.jsx'
import CellEditor from './cell-editor.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'



export class MarkdownCell_unconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.string,
    rendered: PropTypes.bool.isRequired,
    cellSelected: PropTypes.bool.isRequired,
    pageMode: PropTypes.oneOf(['command', 'edit']),
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
  }

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

    let row1 = <CellEditor
          cellId={this.props.cellId}
          containerStyle={{display: editorDisplayStyle}}
          onContainerClick={this.enterEditMode}
          editorOptions = {{
            lineWrapping: true,
            matchBrackets: false,
            autoCloseBrackets: false,
            lineNumbers: false,
          }}
        />
      
    let row2 = <div
          className = 'user-markdown'
          onDoubleClick={this.enterEditMode}
          style={{display: resultDisplayStyle}}
          dangerouslySetInnerHTML={{__html: this.props.value}}
        />

    return <TwoRowCell
        cellId={this.props.cellId}
        row1 = {row1}
        row2 = {row2}
      />
  }

}



export function mapStateToProps(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    value: cell.value,
    rendered: cell.rendered,
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

export default connect(mapStateToProps, mapDispatchToProps)(MarkdownCell_unconnected)
