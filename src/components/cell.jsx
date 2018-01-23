// a Page is a collection of cells. They are displayed in order.
// All javascript cells share the same interpreter.
import React, {createElement} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import deepEqual from 'deep-equal'
import CodeMirror from '@skidding/react-codemirror'
import js from 'codemirror/mode/javascript/javascript'
import css from 'codemirror/mode/css/css'

import markdown from 'codemirror/mode/markdown/markdown'
import matchbrackets from 'codemirror/addon/edit/matchbrackets'
import closebrackets from 'codemirror/addon/edit/closebrackets'
import autorefresh from 'codemirror/addon/display/autorefresh'
import comment from 'codemirror/addon/comment/comment'
import _ from 'lodash'
import ReactTable from 'react-table'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import CheckCircle from 'material-ui/svg-icons/action/check-circle'
import ErrorCircle from 'material-ui/svg-icons/alert/error'
import UnloadedCircle from 'material-ui/svg-icons/content/remove'

import CellRow from './cell-row.jsx'
import formatOutput from './output.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'
import sublime from '../codemirror-keymap-sublime.js'


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
    this.props.actions.deleteCell()
  }

  changeCellType(cellType, evt) {
    this.props.actions.changeCellType(cellType)
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
    return formatOutput(this.props.cell)
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


function parseDOMCellContent(content) {
  let elems = content.split('#')
  let elem = elems[0]
  let elemID
  if (elems.length > 1) {
    elemID = elems[1]
  } else {
    elemID = undefined
  }
  return {elem, elemID}
}

class DOMCell extends GenericCell {
  constructor(props) {
    super(props)
  }

  outputComponent() {
    let elem
    let content = parseDOMCellContent(this.props.cell.content)
    if (content.elem !== '' && content.elem !== undefined) {
      try {
        elem = createElement(content.elem, {id: content.elemID})
      } catch (err) {
        console.error(`elem ${content.elem} is not valid`)
        elem = <div className='dom-cell-error'>{content.elem} is not valid</div>
      }
      
    } else {
      elem = <div className='dom-cell-error'>please add an elem type</div>
    }
    return elem
  }
}

class CSSCell extends GenericCell {
  constructor(props) {
    super(props)
  }

  outputComponent() {
    return <style>
      {this.props.cell.content}
    </style>
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
      <div id={'cell-' + this.props.cell.id} className={'cell-container ' + (this.props.display ? '' : 'hidden-cell')}>
        <div className='cell history-cell'>
          <div className='history-content'>{mainElem}</div>
          <div className='history-date'>{this.props.cell.lastRan.toUTCString()}</div>
        </div>
        <div className={'cell-controls'} />
      </div>
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
let DOMCell_connected = connect(mapStateToPropsForCells, mapDispatchToProps)(DOMCell)
let CSSCell_connected = connect(mapStateToPropsForCells, mapDispatchToProps)(CSSCell)
let ExternalDependencyCell_connected = connect(mapStateToPropsForExternalDependency, mapDispatchToProps)(ExternalDependencyCell)

// export JavascriptCell_connected as JavascriptCell
export {JavascriptCell_connected as JavascriptCell,
  MarkdownCell_connected as MarkdownCell,
  RawCell_connected as RawCell,
  DOMCell_connected as DOMCell,
  CSSCell_connected as CSSCell,
  ExternalDependencyCell_connected as ExternalDependencyCell,
  HistoryCell,
  
}
