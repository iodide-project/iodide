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
import sublime from './codemirror-keymap-sublime.js'

import actions from './actions.jsx'

class CellEditor extends React.Component {
    constructor(props) {
        super(props)
        this.editorOptions = {
            lineNumbers: false,
            mode: this.props.cellType,
            lineWrapping: false,
            theme: 'eclipse',
            autoRefresh: true,
            readOnly: this.props.viewMode=="presentation"
        }
        // explicitly bind "this" for all methods in constructors
        this.getEditorElementRef = this.getEditorElementRef.bind(this)
        this.handleFocusChange = this.handleFocusChange.bind(this)
        this.enterEditMode = this.enterEditMode.bind(this)
        this.updateInputContent = this.updateInputContent.bind(this)
    }

    getEditorElementRef(editorElt){
        this.editor = editorElt
    }

    handleFocusChange(focused){
        if (focused && this.props.viewMode!=='editor'){
            if (!this.props.cellSelected) this.props.actions.selectCell(this.props.cellId)
            if (!this.props.pageMode!='edit') this.props.actions.changeMode('edit')
        }
    }

    updateInputContent(content) {
        this.props.actions.updateInputContent(content)
    }

    render(){
        return (
            <div className="editor" >
                <CodeMirror ref={this.getEditorElementRef}
                    value={this.props.content}
                    options={this.editorOptions}
                    onChange={this.updateInputContent} 
                    onFocusChange={this.handleFocusChange}}
                />
            </div>
        )
    }

    componentDidMount(){
        if (this.props.cellSelected
            && this.refs.hasOwnProperty('editor')
            && this.props.pageMode == 'edit') {
            this.editor.focus()
        }
    }

    componentDidUpdate(prevProps,prevState){
        if (this.props.cellSelected && this.props.pageMode == 'edit') {
            this.editor.focus()
        }
        if (this.props.pageMode!='edit' || this.props.viewMode!='editor') {
            this.editor.getCodeMirror().display.input.textarea.blur()
        }
    }
}

function mapStateToPropsForCells(state,ownProps) {
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