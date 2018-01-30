// a Page is a collection of cells. They are displayed in order.
// All javascript cells share the same interpreter.
import React, {createElement} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import deepEqual from 'deep-equal'

import CellRow from './cell-row.jsx'
import CellEditor from './cell-editor.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'
// import sublime from '../codemirror-keymap-sublime.js'


class GenericCell extends React.Component {
  /* Generic cell implements a basic cell with a code mirror editor
    in text-wrap mode (like MD or Raw), and with empty output component
    Override input/output components for different behavior
    */
  constructor(props) {
    super(props)
    this.hasEditor = true
    this.editorOptions = {
      lineNumbers: false,
      mode: this.props.cell.cellType,
      lineWrapping: false,
      theme: 'eclipse',
      autoRefresh: true,
    }

    this.handleCellClick = this.handleCellClick.bind(this)
    this.inputComponent = this.inputComponent.bind(this)
    this.outputComponent = this.outputComponent.bind(this)
    this.editorElementRefCallback = this.editorElementRefCallback.bind(this)
    
  }

  handleCellClick(e) {
    console.log("handleCellClick")
    if (this.props.viewMode === 'editor') {
      let scrollToCell = false
      if (!this.props.cell.selected) {
        this.props.actions.selectCell(this.props.cell.id, scrollToCell)
      }
    }
  }


  shouldComponentUpdate(nextProps, nextState) {
    let propsEqual = deepEqual(this.props, nextProps)
    return !propsEqual
  }



  editorElementRefCallback(ref){
    // see https://reactjs.org/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components
    this.editor = ref
  }

  inputComponent() {
    let editorOptions = Object.assign({},
      this.editorOptions,
      {readOnly: (this.props.viewMode === 'presentation' ? 'nocursor' : false)}
    )
    return <CellEditor
      inputRef={this.editorElementRefCallback}
      cellId={this.props.cell.id}
    />
  }

  outputComponent() {
    return <div />
  }

  render() {
    let cellSelected = this.props.cell.selected ? 'selected-cell ' : ''
    let editorMode = (
      (this.props.cell.selected && this.props.pageMode === 'edit')
        ? 'edit-mode ' : 'command-mode '
    )
    let cellId = this.props.cell.id
    let cellType = this.props.cell.cellType
    let collapseInput, collapseOutput
    if (this.props.viewMode === 'presentation') {
      collapseInput = this.props.cell.collapsePresentationViewInput
      collapseOutput = this.props.cell.collapsePresentationViewOutput
    } else if (this.props.viewMode === 'editor') {
      collapseInput = this.props.cell.collapseEditViewInput
      collapseOutput = this.props.cell.collapseEditViewOutput
    }
    let collapseBoth = (collapseInput === 'COLLAPSED' &&
            collapseOutput === 'COLLAPSED') ? 'collapse-both' : ''
    let cellClass = ['cell-container', cellSelected,
      editorMode, cellType, collapseBoth].join(' ')

    return (
      <div id={'cell-' + cellId}
        className={cellClass}
        onMouseDown={this.handleCellClick} >
        <CellRow cellId={cellId} rowType={'input'}>
          {this.inputComponent()}
        </CellRow>
        <CellRow cellId={cellId} rowType={'output'}>
          {this.outputComponent()}
        </CellRow>
      </div>
    )
  }
}



export {GenericCell}
