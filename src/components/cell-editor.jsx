import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import deepEqual from 'deep-equal'

import CodeMirror from '@skidding/react-codemirror'
import js from 'codemirror/mode/javascript/javascript'
import markdown from 'codemirror/mode/markdown/markdown'
import matchbrackets from 'codemirror/addon/edit/matchbrackets'
import closebrackets from 'codemirror/addon/edit/closebrackets'
import autorefresh from 'codemirror/addon/display/autorefresh'
import comment from 'codemirror/addon/comment/comment'
import sublime from '../codemirror-keymap-sublime'

import {getCellById} from '../notebook-utils.js'
import actions from '../actions'

class CellEditor extends React.Component {
  constructor(props) {
    super(props)
    this.editorOptions = Object.assign(
      {lineNumbers: false,
        mode: this.props.cellType,
        lineWrapping: false,
        theme: 'eclipse',
        autoRefresh: true,
        readOnly: this.props.viewMode==='presentation'
      }, props.editorOptions )
    // explicitly bind "this" for all methods in constructors
    this.storeEditorElementRef = this.storeEditorElementRef.bind(this)
    this.handleFocusChange = this.handleFocusChange.bind(this)
    // this.enterEditMode = this.enterEditMode.bind(this)
    this.updateInputContent = this.updateInputContent.bind(this)
    // this.passEditorElementRefUp = this.passEditorElementRefUp.bind(this)
    this.storeEditorElementRef = this.storeEditorElementRef.bind(this)
  }

  storeEditorElementRef(editorElt){
    this.editor = editorElt
    //pass this cm instance ref up to the parent cell with this callback
    this.props.inputRef(editorElt)
  }

  // passEditorElementRefUp(){
  //   return this.editor
  // }

  handleFocusChange(focused) {
    console.log("handleFocusChange", focused, this)
    // it's essential to only trigger these actions when this *is already focused*,
    // because if a CHANGE_MODE is triggered in command mode, it will cause the
    // active element to be blurred, which will cause a focus change, which will
    // fire the actions below in the middle of the CHANGE_MODE state update.
    if (focused && this.props.viewMode === 'editor') {
      if (!this.props.cellSelected) this.props.actions.selectCell(this.props.cellId)
      if (!this.props.pageMode !== 'edit' && this.props.viewMode === 'editor') {
        this.props.actions.changeMode('edit')
      }
    }
    // if (this.hasEditor) this.refs.editor.focus()
  }

  updateInputContent(content) {
    this.props.actions.updateInputContent(content)
  }

  render(){
    return (
      <div className="editor"
        onClick = {this.props.onContainerClick}
        style = {this.props.containerStyle}
      >
        <CodeMirror ref={this.storeEditorElementRef}
          value={this.props.content}
          options={this.editorOptions}
          onChange={this.updateInputContent} 
          onFocusChange={this.handleFocusChange}
        />
      </div>
    )
  }

  componentDidMount(){
    // console.log("editor - componentDidMount - this", this)
    if (this.props.cellSelected
      && this.refs.hasOwnProperty('editor')
      && this.props.pageMode == 'edit') {
      this.editor.focus()
    }
  }

  componentDidUpdate(prevProps,prevState){
  // console.log("editor - componentDidUpdate - this", this)
    if (this.props.cellSelected && this.props.pageMode == 'edit') {
      this.editor.focus()
    }
    if (this.props.pageMode!='edit' || this.props.viewMode!='editor') {
      this.editor.getCodeMirror().display.input.textarea.blur()
    }
  }
}






function mapStateToProps(state,ownProps) {
  // console.log(state)
  // console.log(ownProps)
  let cellId = ownProps.cellId
  let cell = getCellById(state.cells, cellId) 
  return {
    readOnly: ownProps.readOnly,
    pageMode: state.mode,
    viewMode: state.viewMode,
    cellSelected: cell.selected,
    cellType: cell.cellType,
    content: cell.content,
    cellId: cellId
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CellEditor)