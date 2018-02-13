import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

// import TwoRowCell from './two-row-cell'
import OneRowCell from './one-row-cell'

import CellEditor from './cell-editor'

import actions from '../actions'
import { getCellById } from '../notebook-utils'


export class MarkdownCellUnconnected extends React.Component {
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
    let resultDisplayStyle
    let editorDisplayStyle
    if (this.props.rendered &&
          !(this.props.cellSelected &&
            this.props.pageMode === 'edit')) {
      resultDisplayStyle = 'block'
      editorDisplayStyle = 'none'
    } else {
      resultDisplayStyle = 'none'
      editorDisplayStyle = 'block'
    }

    const row1 = (<CellEditor
      cellId={this.props.cellId}
      containerStyle={{ display: editorDisplayStyle }}
      onContainerClick={this.enterEditMode}
      editorOptions={{
            lineWrapping: true,
            matchBrackets: false,
            autoCloseBrackets: false,
            lineNumbers: false,
          }}
    />)

    const row2 = (<div
      className="user-markdown"
      onDoubleClick={this.enterEditMode}
      style={{ display: resultDisplayStyle }}
      dangerouslySetInnerHTML={{ __html: this.props.value }} // eslint-disable-line
    />)

    // return (<TwoRowCell
    //   cellId={this.props.cellId}
    //   row1={row1}
    //   row2={row2}
    // />)
    return (
      <OneRowCell cellId={this.props.cellId}>
        {row1}
        {row2}
      </OneRowCell>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
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

export default connect(mapStateToProps, mapDispatchToProps)(MarkdownCellUnconnected)
