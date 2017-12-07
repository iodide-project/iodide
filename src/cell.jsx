// a Page is a collection of cells. They are displayed in order.
// All javascript cells share the same interpreter.
import React, {createElement} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import deepEqual from 'deep-equal'

import CodeMirror from '@skidding/react-codemirror'
import js from 'codemirror/mode/javascript/javascript'
import markdown from 'codemirror/mode/markdown/markdown'
import matchbrackets from 'codemirror/addon/edit/matchbrackets'
import closebrackets from 'codemirror/addon/edit/closebrackets'
import autorefresh from 'codemirror/addon/display/autorefresh'
import comment from 'codemirror/addon/comment/comment'
import sublime from './codemirror-keymap-sublime.js'

import {FormGroup, FormControl, ControlLabel, Form} from 'react-bootstrap'

import _ from 'lodash'
import nb from '../tools/nb.js'

import {getCellById} from './notebook-utils.js'

import {PrettyMatrix, SimpleTable, makeMatrixText} from './pretty-matrix.jsx'
import ReactTable from 'react-table'
import JSONTree from 'react-json-tree'

import CellRow from './cell-row.jsx'

import actions from './actions.jsx'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import CheckCircle from 'material-ui/svg-icons/action/check-circle'
import ErrorCircle from 'material-ui/svg-icons/alert/error'
import UnloadedCircle from 'material-ui/svg-icons/content/remove'

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
    // explicitly bind "this" for all methods in constructors
    this.evaluateCell = this.evaluateCell.bind(this)
    this.cellUp = this.cellUp.bind(this)
    this.cellDown = this.cellDown.bind(this)
    this.deleteCell = this.deleteCell.bind(this)
    this.changeCellType = this.changeCellType.bind(this)
    this.handleCellClick = this.handleCellClick.bind(this)
    this.enterEditMode = this.enterEditMode.bind(this)
    // this.handleCollapseButtonClick = this.handleCollapseButtonClick.bind(this)
    // this.handleCollapseInputClick = this.handleCollapseInputClick.bind(this)
    // this.handleCollapseOutputClick = this.handleCollapseOutputClick.bind(this)
    this.updateInputContent = this.updateInputContent.bind(this)
    this.inputComponent = this.inputComponent.bind(this)
    this.outputComponent = this.outputComponent.bind(this)
  }

  evaluateCell() {
    this.props.actions.evaluateCell()
  }

  cellUp() {
    this.props.actions.cellUp()
  }

  cellDown() {
    this.props.actions.cellDown()
  }

  deleteCell() {
    this.props.actions.deleteCell(this.props.cell.id)
  }

  changeCellType(cellType, evt) {
    this.props.actions.changeCellType(this.props.cell.id, cellType)
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
    console.log('cell deepequal', this.props.id, propsEqual)
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
    console.log('componentDidUpdate', this.props.cell.id)
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
    this.props.actions.updateInputContent(this.props.cell.id, content)
  }

  inputComponent() {
    console.log('inputComponent', this.props.cell.id)
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
    return <div />
  }

  render() {
    console.log('cell render', this.props.cell.id)
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
        <CellRow cellId={cellId}
          rowType={'input'}
          mainComponent={this.inputComponent()} />
        <CellRow cellId={cellId}
          rowType={'output'}
          mainComponent={this.outputComponent()} />
      </div>
    )
  }
}

class ExternalDependencyCell extends GenericCell {
  constructor(props) {
    super(props)
  }

  outputComponent() {
    if (this.props.cell.value == undefined) return undefined
    let outs = this.props.cell.value.map((d) => {
      let statusExplanation
      let statusIcon = d.status === undefined
        ? <UnloadedCircle />
        : (d.status === 'loaded'
          ? <CheckCircle color='lightblue' />
          : <ErrorCircle color='firebrick' />

        )
      if (d.hasOwnProperty('statusExplanation')) {
        statusExplanation = <div className='dependency-status-explanation'>{d.statusExplanation}</div>
      }
      return (
        <div className='dependency-container'>
          <div className='dependency-row'>
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
              {statusIcon}
            </MuiThemeProvider>
            <div className='dependency-src'>{d.src}</div>
          </div>
          {statusExplanation}
        </div>
      )
    })
    return (
      <div className='dependency-output'>
        {outs}
      </div>
    )
  }
}

class RawCell extends GenericCell {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    // FIXME: this is of a hack to make sure that the output for raw cells
    // is set to COLLAPSED in presentation View
    this.props.actions.setCellCollapsedState(
      this.props.cell.id,
      'presentation',
      'output',
      'COLLAPSED')
  }
}

class JavascriptCell extends GenericCell {
  constructor(props) {
    super(props)
    this.editorOptions.lineNumbers = true
    this.editorOptions.matchBrackets = true
    this.editorOptions.autoCloseBrackets = true
    this.editorOptions.keyMap = 'sublime'
    this.outputComponent = this.outputComponent.bind(this)
  }

  outputComponent() {
    return jsReturnValue(this.props.cell)
  }
}

class ExternalScriptCell extends GenericCell {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    // FIXME: this is of a hack to make sure that the output for raw cells
    // is set to COLLAPSED in presentation View
    // THIS SHOULD BE REMOVED ONCE EXTERNAL SCRIPT CELLS RETURN A TRUE OUTPUT
    this.props.actions.setCellCollapsedState(
      this.props.cell.id,
      'presentation',
      'output',
      'COLLAPSED')
  }
}

class MarkdownCell extends GenericCell {
  constructor(props) {
    super(props)
    this.editorOptions.lineWrapping = true
    this.enterEditMode = this.enterEditMode.bind(this)
    this.inputComponent = this.inputComponent.bind(this)
    this.outputComponent = this.outputComponent.bind(this)
  }

  enterEditMode() {
    if (this.props.viewMode == 'editor') {
      super.enterEditMode()
      this.props.actions.markCellNotRendered()
    }
  }

  inputComponent() {
    let editorDisplayStyle = (
      !this.props.cell.rendered ||
            (this.props.cell.selected &&
                this.props.pageMode == 'edit')
    ) ? 'block' : 'none'

    let cmInstance = <CodeMirror ref='editor'
      value={this.props.cell.content}
      onChange={this.updateInputContent}
      onFocus={this.enterEditMode}
      options={this.editorOptions} />

    return (
      <div className='editor'
        style={{display: editorDisplayStyle}}
        onClick={this.enterEditMode}>
        {cmInstance}
      </div>
    )
  }

  outputComponent() {
    // the rendered MD is shown if this cell is NOT being edited
    // and if this.props.cell.rendered
    let resultDisplayStyle = ((
      this.props.cell.rendered &&
            !(this.props.cell.selected &&
                this.props.pageMode == 'edit')
    ) ? 'block' : 'none')
    return <div onDoubleClick={this.enterEditMode}
      style={{display: resultDisplayStyle}}
      dangerouslySetInnerHTML={{__html: this.props.cell.value}} />
  }
}

class DOMCell extends GenericCell {
  constructor(props) {
    super(props)
    // explicitly bind "this" for all methods in constructors
    this.changeElementType = this.changeElementType.bind(this)
    this.changeElementID = this.changeElementID.bind(this)
    this.hasEditor = false
  }

  componentWillMount() {
    if (!this.props.cell.hasOwnProperty('elementType')) this.props.actions.changeElementType(this.props.cell.id, 'div')
    if (!this.props.cell.hasOwnProperty('domElementID')) this.props.actions.changeDOMElementID(this.props.cell.id, 'dom-cell-' + this.props.cell.id)
  }

  changeElementType(event) {
    let elementType = event.target.value.trim()
    this.props.actions.changeElementType(this.props.cell.id, elementType)
  }

  changeElementID(event) {
    let elementID = event.target.value.trim()
    this.props.actions.changeDOMElementID(this.props.cell.id, elementID)
  }

  // FIXME!! need to Override enterEditMode for DOMCell to focus the inputs
  //     enterEditMode(){
  //         super.enterEditMode()
  //         if (this.hasEditor) this.refs.editor.focus()
  //     }

  inputComponent() {
    return (
      <div className='dom-cell-elementType'
        style={{display: this.props.cell.selected ? 'inherit' : 'none'}}>
        <Form className='dom-inputs' inline>
          <FormGroup bsSize='small' controlId={'dom-' + this.props.cell.id}>
            <ControlLabel className='right-spacer'>tag</ControlLabel>
            <FormControl className='right-spacer' type='text'
              onChange={this.changeElementType}
              value={this.props.cell.elementType}
              placeholder='div, svg, etc.' />
            <ControlLabel className='right-spacer'>css ID</ControlLabel>
            <FormControl type='text' onChange={this.changeElementID}
              value={this.props.cell.domElementID} placeholder='id' />
          </FormGroup>
        </Form>
      </div>
    )
  }

  outputComponent() {
    let elem
    if (this.props.cell.elementType.length) {
      elem = createElement(this.props.cell.elementType, {id: this.props.cell.domElementID})
    } else {
      elem = <div className='dom-cell-error'>please add an elem type</div>
    }
    return elem
  }
}

class HistoryCell extends GenericCell {
  constructor(props) {
    super(props)
  }

  render() {
    let options = {
      lineNumbers: true,
      readOnly: true,
      mode: this.props.cell.cellType,
      theme: 'eclipse',
    }
    let mainElem = <CodeMirror ref='editor'
      value={this.props.cell.content}
      options={options} />

    return (
      <div className={'cell-container ' + (this.props.display ? '' : 'hidden-cell')}>
        <div className='cell history-cell'>
          <div className='history-content'>{mainElem}</div>
          <div className='history-date'>{this.props.cell.lastRan.toUTCString()}</div>
        </div>
        <div className={'cell-controls'} />
      </div>
    )
  }
}

function jsReturnValue(cell) {
  let resultElem
  let returnedSomething
  if (cell.value == undefined && !cell.rendered) returnedSomething = false
  if (cell.value !== undefined) returnedSomething = true
  if (cell.value == undefined && cell.rendered) returnedSomething = true
  if (returnedSomething) {
    if (cell.value == undefined) {
      resultElem = <div className='data-set-info'>undefined</div>
    } else if (nb.isRowDf(cell.value)) {
      let columns = Object.keys(cell.value[0]).map((k) => ({Header: k, accessor: k}))
      var dataSetInfo = `array of objects: ${cell.value.length} rows, ${columns.length} columns`
      resultElem = (<div>
        <div className='data-set-info'>{dataSetInfo}</div>
        <ReactTable
          data={cell.value}
          columns={columns}
          showPaginationTop
          showPaginationBottom={false}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          defaultPageSize={25}
        />
      </div>)
    } else if (nb.isMatrix(cell.value)) {
      let shape = nb.shape(cell.value)
      var dataSetInfo = `${shape[0]} × ${shape[1]} matrix (array of arrays)`
      let tabledata = makeMatrixText(cell.value, [10, 10])
      resultElem = (<div>
        <div className='data-set-info'>{dataSetInfo}</div>
        <SimpleTable tabledata={tabledata} />
      </div>)
    } else if (_.isArray(cell.value)) {
      var dataSetInfo = `${cell.value.length} element array`
      let len = cell.value.length
      if (len < 500) {
        var arrayOutput = `[${cell.value.join(', ')}]`
      } else {
        var arrayOutput = `[${cell.value.slice(0, 100).join(', ')}, ... , ${cell.value.slice(len - 100, len).join(', ')}]`
      }
      resultElem = (<div>
        <div className='data-set-info'>{dataSetInfo}</div>
        <div className='array-output'>{arrayOutput}</div>
      </div>)
    } else {
      resultElem = <JSONTree
        data={cell.value}
        shouldExpandNode={(keyName, data, level) => {
          return false
        }}
        hideRoot={false}
        theme={{
          scheme: 'bright',
          author: 'chris kempson (http://chriskempson.com)',
          base00: '#000000',
          base01: '#303030',
          base02: '#505050',
          base03: '#b0b0b0',
          base04: '#d0d0d0',
          base05: '#e0e0e0',
          base06: '#f5f5f5',
          base07: '#ffffff',
          base08: '#fb0120',
          base09: '#fc6d24',
          base0A: '#fda331',
          base0B: '#a1c659',
          base0C: '#76c7b7',
          base0D: '#6fb3d2',
          base0E: '#d381c3',
          base0F: '#be643c',
        }} />
    }
  } else {
    resultElem = <div className='empty-resultset' />
  }
  return resultElem
}

function mapStateToPropsForCells(state, ownProps) {
  console.log('mapStateToPropsForCells')
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

function mapStateToPropsForExternalDependency(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    display: true,
    pageMode: state.mode,
    viewMode: state.viewMode,
    ref: 'cell' + cell.id,
    cell: Object.assign({}, cell),
    id: cell.id,
    dependencies: cell.dependencies, // Object.assign({}, cell.dependencies || [])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Page)
let JavascriptCell_connected = connect(mapStateToPropsForCells, mapDispatchToProps)(JavascriptCell)
let MarkdownCell_connected = connect(mapStateToPropsForCells, mapDispatchToProps)(MarkdownCell)
let RawCell_connected = connect(mapStateToPropsForCells, mapDispatchToProps)(RawCell)
let ExternalScriptCell_connected = connect(mapStateToPropsForCells, mapDispatchToProps)(ExternalScriptCell)
let DOMCell_connected = connect(mapStateToPropsForCells, mapDispatchToProps)(DOMCell)
let ExternalDependencyCell_connected = connect(mapStateToPropsForExternalDependency, mapDispatchToProps)(ExternalDependencyCell)

// export JavascriptCell_connected as JavascriptCell
export {JavascriptCell_connected as JavascriptCell,
  MarkdownCell_connected as MarkdownCell,
  RawCell_connected as RawCell,
  ExternalScriptCell_connected as ExternalScriptCell,
  DOMCell_connected as DOMCell,
  ExternalDependencyCell_connected as ExternalDependencyCell,
  HistoryCell,
}
