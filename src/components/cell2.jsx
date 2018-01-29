// a Page is a collection of cells. They are displayed in order.
// All javascript cells share the same interpreter.
import React, {createElement} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import deepEqual from 'deep-equal'
import CodeMirror from '@skidding/react-codemirror'
import js from 'codemirror/mode/javascript/javascript'

import matchbrackets from 'codemirror/addon/edit/matchbrackets'
import closebrackets from 'codemirror/addon/edit/closebrackets'
import autorefresh from 'codemirror/addon/display/autorefresh'
import comment from 'codemirror/addon/comment/comment'
import _ from 'lodash'

import CellRow from './cell-row.jsx'
import CellOutput from './output.jsx'
import CellEditor from './cell-editor.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'
import sublime from '../codemirror-keymap-sublime.js'


class CellContainer extends React.Component {
  /* Cell is a container that 
    */
  constructor(props) {
    super(props)
    this.hasEditor = this.props.hasEditor

    // explicitly bind "this" for all methods in constructors
    this.handleCellClick = this.handleCellClick.bind(this)
    this.enterEditMode = this.enterEditMode.bind(this)
    this.updateInputContent = this.updateInputContent.bind(this)
  }

  handleCellClick(e) {
    if (this.props.viewMode === 'editor') {
      let scrollToCell = false
      if (!this.props.cell.selected) this.props.actions.selectCell(this.props.cell.id, scrollToCell)
      if (this.props.pageMode === 'edit' &&
                (this.hasEditor && !this.refs.editor.getCodeMirror().display.wrapper.contains(e.target))) {
        this.props.actions.changeMode('command')
      }
    }
  }

  enterEditMode() {
    if (this.props.viewMode === 'editor') {
      if (!this.props.cell.selected) this.props.actions.selectCell(this.props.cell.id)
      if (!this.props.pageMode !== 'edit' && this.props.viewMode === 'editor') {
        this.props.actions.changeMode('edit')
      }
    }
    // if (this.hasEditor) this.refs.editor.focus()
  }

  shouldComponentUpdate(nextProps, nextState) {
    let propsEqual = deepEqual(this.props, nextProps)
    return !propsEqual
  }

  componentDidMount() {
    if (this.props.cell.selected &&
            this.refs.hasOwnProperty('editor') &&
            this.props.pageMode === 'edit') {
      this.refs.editor.focus()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.cell.selected &&
            this.refs.hasOwnProperty('editor') &&
            this.props.pageMode === 'edit') {
      this.refs.editor.focus()
    }
    if (this.hasEditor && this.props.pageMode !== 'edit') {
      this.refs.editor.getCodeMirror().display.input.textarea.blur()
    }
  }

  updateInputContent(content) {
    this.props.actions.updateInputContent(content)
  }


  render() {
    // let cellSelected = this.props.cell.selected ? 'selected-cell ' : ''
    // let editorMode = (
    //   (this.props.cell.selected && this.props.pageMode === 'edit')
    //     ? 'edit-mode ' : 'command-mode '
    // )
    let cellId = this.props.cell.id
    // let cellType = this.props.cell.cellType
    // let collapseInput, collapseOutput
    // if (this.props.viewMode === 'presentation') {
    //   collapseInput = this.props.cell.collapsePresentationViewInput
    //   collapseOutput = this.props.cell.collapsePresentationViewOutput
    // } else if (this.props.viewMode === 'editor') {
    //   collapseInput = this.props.cell.collapseEditViewInput
    //   collapseOutput = this.props.cell.collapseEditViewOutput
    // }
    // let collapseBoth = (collapseInput === 'COLLAPSED' &&
    //         collapseOutput === 'COLLAPSED') ? 'collapse-both' : ''
    // let cellClass = ['cell-container cell2', cellSelected,
    //   editorMode, cellType, collapseBoth].join(' ')

    return (
      <div id={'cell-' + cellId}
        className={this.props.cellClass}
        onMouseDown={this.handleCellClick} >
        {this.props.children}
      </div>
    )
  }
}


class JsCell extends React.Component {
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
    this.inputComponent = this.inputComponent.bind(this)
    this.outputComponent = this.outputComponent.bind(this)
  }

  inputComponent() {
    let editorOptions = Object.assign({},
      this.editorOptions,
      {readOnly: (this.props.viewMode === 'presentation' ? 'nocursor' : false)}
    )
    return (
      <div className='editor' >
        <CodeMirror ref='editor'
          value={this.props.cell.content}
          onChange={this.updateInputContent}
          onFocusChange={(focus) => {
            if (focus && this.props.pageMode !== 'edit') this.enterEditMode()
          }}
          options={editorOptions} />
      </div>
    )
  }

  outputComponent() {
    console.log("outputComponent")
    console.log(this)
    const cell = this.props.cell
    if (cell.cellType == 'dom' ||
        (cell.value == undefined && !cell.rendered)) {
      return <div className='empty-resultset' />
    } else {
      return <CellOutput valueToRender={cell.value} />
    }
  }

  render() {
    console.log("render")
    console.log(this)
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
    let cellClass = ['cell-container js2', cellSelected,
      editorMode, cellType, collapseBoth].join(' ')

    // let result
    // const cell = this.props.cell
    // if (cell.cellType == 'dom' || (cell.value == undefined && !cell.rendered)) {
    //   result = <div className='empty-resultset' />
    // } else {
    //   result = <CellOutput valueToRender={cell.value} />
    // }

    return (
      <CellContainer hasEditor={true} cell={this.props.cell} cellClass={cellClass} >
        <CellRow cellId={cellId} rowType={'input'}>
            {this.inputComponent() /*<CellEditor/>*/}
            <CellEditor cellId={cellId}/>
        </CellRow>
        <CellRow cellId={cellId} rowType={'output'}>
            {this.outputComponent() /*<OutputComponent cellId={cellId}/>*/}
        </CellRow>
      </CellContainer>
    )
  }
}



function mapStateToPropsForCells(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    display: true,
    pageMode: state.mode,
    viewMode: state.viewMode,
    ref: 'cell' + cell.id,
    cell: Object.assign({}, cell),
    id: cell.id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Page)
let JsCell_connected = connect(mapStateToPropsForCells, mapDispatchToProps)(JsCell)

// export JavascriptCell_connected as JavascriptCell
export {JsCell_connected as JsCell}
