import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types';

/* eslint-disable */
import CodeMirror from '@skidding/react-codemirror'
import js from 'codemirror/mode/javascript/javascript'
import markdown from 'codemirror/mode/markdown/markdown'
import css from 'codemirror/mode/css/css'

import matchbrackets from 'codemirror/addon/edit/matchbrackets'

import closebrackets from 'codemirror/addon/edit/closebrackets'
import autorefresh from 'codemirror/addon/display/autorefresh'
import comment from 'codemirror/addon/comment/comment'
import sublime from '../codemirror-keymap-sublime'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'
/* eslint-enable */
import { getCellById } from '../notebook-utils'
import actions from '../actions'
import { getLanguageByName } from '../language'

class CellEditor extends React.Component {
  static propTypes = {
    // readOnly: PropTypes.bool.isRequired,
    cellSelected: PropTypes.bool.isRequired,
    cellId: PropTypes.number.isRequired,
    cellType: PropTypes.string,
    content: PropTypes.string,
    pageMode: PropTypes.oneOf(['command', 'edit', 'title-edit']),
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    actions: PropTypes.shape({
      selectCell: PropTypes.func.isRequired,
      changeMode: PropTypes.func.isRequired,
      updateInputContent: PropTypes.func.isRequired,
    }).isRequired,
    inputRef: PropTypes.func,
    onContainerClick: PropTypes.func,
    containerStyle: PropTypes.object,
    editorOptions: PropTypes.object,
    language: PropTypes.string,
  }

  constructor(props) {
    super(props)
    // explicitly bind "this" for all methods in constructors
    this.storeEditorElementRef = this.storeEditorElementRef.bind(this)
    this.handleFocusChange = this.handleFocusChange.bind(this)
    this.updateInputContent = this.updateInputContent.bind(this)
    this.storeEditorElementRef = this.storeEditorElementRef.bind(this)
  }

  componentDidMount() {
    if (this.props.cellSelected
      && this.refs.hasOwnProperty('editor') // eslint-disable-line
      && this.props.pageMode === 'edit') {
      this.editor.focus()
    }
  }

  componentDidUpdate() {
    if (this.props.cellSelected && this.props.pageMode === 'edit') {
      this.editor.focus()
    }
    if (!this.props.cellSelected && this.props.pageMode === 'edit') {
      this.editor.getCodeMirror().display.input.textarea.blur()
    }
    if (this.props.pageMode !== 'edit' || this.props.viewMode !== 'editor') {
      this.editor.getCodeMirror().display.input.textarea.blur()
    }
  }

  getMode() {
    let mode = this.props.cellType
    if (mode === 'code') {
      const language = getLanguageByName(this.props.language)
      if (language !== undefined) {
        mode = language.codeMirrorName
      }
    }
    return mode
  }

  handleFocusChange(focused) {
    if (focused && this.props.viewMode === 'editor') {
      if (!this.props.cellSelected) {
        this.props.actions.selectCell(this.props.cellId)
      }
      if (!this.props.pageMode !== 'edit' && this.props.viewMode === 'editor') {
        this.props.actions.changeMode('edit')
      }
    } else if (!focused && this.props.viewMode === 'editor') {
      this.props.actions.changeMode('command')
    }
  }

  storeEditorElementRef(editorElt) {
    this.editor = editorElt
    // pass this cm instance ref up to the parent cell with this callback
    if (this.props.inputRef) {
      this.props.inputRef(editorElt)
    }
  }

  updateInputContent(content) {
    this.props.actions.updateInputContent(content)
  }

  autoComplete = (cm) => {
    const codeMirror = this.editor.getCodeMirrorInstance()
    // hint options for specific plugin & general show-hint
    // Other general hint config, like 'completeSingle' and 'completeOnSingleClick'
    // should be specified here and will be honored
    const hintOptions = {
      disableKeywords: true,
      completeSingle: false,
      completeOnSingleClick: false,
    }
    // Reference the hint function imported here when including other hint addons
    // or supply your own
    codeMirror.showHint(cm, codeMirror.hint.javascript, hintOptions);
  }

  render() {
    const mode = this.getMode()

    const editorOptions = Object.assign({
      mode,
      lineWrapping: false,
      matchBrackets: true,
      autoCloseBrackets: true,
      theme: 'eclipse',
      autoRefresh: true,
      lineNumbers: true,
      keyMap: 'sublime',
      extraKeys: {
        'Ctrl-Space': this.props.language === 'js' ? this.autoComplete : undefined,
      },
      comment: this.props.language === 'js',
      readOnly: this.props.viewMode === 'presentation',
    }, this.props.editorOptions)

    return (
      <div
        className="editor"
        // onClick={this.props.onContainerClick}
        style={this.props.containerStyle}
      >
        <CodeMirror
          ref={this.storeEditorElementRef}
          value={this.props.content}
          options={editorOptions}
          onChange={this.updateInputContent}
          onFocusChange={this.handleFocusChange}
        />
      </div>
    )
  }
}


function mapStateToProps(state, ownProps) {
  const { cellId } = ownProps
  const cell = getCellById(state.cells, cellId)
  return {
    // readOnly: ownProps.readOnly,
    pageMode: state.mode,
    viewMode: state.viewMode,
    cellSelected: cell.selected,
    cellType: cell.cellType,
    content: cell.content,
    cellId,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CellEditor)
