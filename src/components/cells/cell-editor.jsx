import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types';


import CodeMirror from '@skidding/react-codemirror'
import js from 'codemirror/mode/javascript/javascript' // eslint-disable-line no-unused-vars
import markdown from 'codemirror/mode/markdown/markdown' // eslint-disable-line no-unused-vars
import css from 'codemirror/mode/css/css' // eslint-disable-line no-unused-vars
import matchbrackets from 'codemirror/addon/edit/matchbrackets' // eslint-disable-line no-unused-vars
import closebrackets from 'codemirror/addon/edit/closebrackets' // eslint-disable-line no-unused-vars
import autorefresh from 'codemirror/addon/display/autorefresh' // eslint-disable-line no-unused-vars
import comment from 'codemirror/addon/comment/comment' // eslint-disable-line no-unused-vars
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'

import sublime from '../../codemirror-keymap-sublime' // eslint-disable-line no-unused-vars
import { getCellById } from '../../tools/notebook-utils'
import * as actions from '../../actions/actions'

// This block is from CodeMirror's loadmode.js, modified to work in this environment
{
  const CodeMirrorBase = require('codemirror') // eslint-disable-line
  CodeMirrorBase.modeUrl =
    `https://cdnjs.cloudflare.com/ajax/libs/codemirror/${CodeMirrorBase.version}/mode/%N/%N.js`
  window.CodeMirror = CodeMirrorBase

  const modeLoading = {}
  function splitCallback(cont, n) {
    let countDown = n
    return () => {
      countDown -= 1
      if (countDown === 0) {
        cont()
      }
    }
  }

  function ensureDeps(mode, cont) {
    const deps = CodeMirrorBase.modes[mode].dependencies
    if (!deps) return cont()
    const missing = []
    for (let i = 0; i < deps.length; ++i) {
      if (!Object.prototype.hasOwnProperty.call(CodeMirrorBase.modes, deps[i])) {
        missing.push(deps[i])
      }
    }
    if (!missing.length) return cont()
    const split = splitCallback(cont, missing.length)
    for (let i = 0; i < missing.length; ++i) {
      CodeMirrorBase.requireMode(missing[i], split)
    }
    return undefined
  }

  CodeMirrorBase.requireMode = (mode, cont) => {
    if (Object.prototype.hasOwnProperty.call(CodeMirrorBase.modes, mode)) {
      return ensureDeps(mode, cont)
    }
    if (Object.prototype.hasOwnProperty.call(modeLoading, mode)) {
      return modeLoading[mode].push(cont)
    }

    const file = CodeMirrorBase.modeUrl.replace(/%N/g, mode)
    const script = document.createElement('script')
    script.src = file
    const others = document.getElementsByTagName('script')[0]
    modeLoading[mode] = [cont]
    const list = modeLoading[mode]
    CodeMirrorBase.on(script, 'load', () => {
      ensureDeps(mode, () => {
        for (let i = 0; i < list.length; ++i) list[i]()
      })
    })
    others.parentNode.insertBefore(script, others)
    return undefined
  }
}

class CellEditor extends React.Component {
  static propTypes = {
    // readOnly: PropTypes.bool.isRequired,
    cellId: PropTypes.number.isRequired,
    cellType: PropTypes.string,
    content: PropTypes.string,
    highlighted: PropTypes.bool.isRequired,
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    languageIsAvailable: PropTypes.bool,
    actions: PropTypes.shape({
      selectCell: PropTypes.func.isRequired,
      changeMode: PropTypes.func.isRequired,
      updateInputContent: PropTypes.func.isRequired,
      unHighlightCells: PropTypes.func.isRequired,
    }).isRequired,
    inputRef: PropTypes.func,
    containerStyle: PropTypes.object,
    editorOptions: PropTypes.object,
  }

  constructor(props) {
    super(props)
    // explicitly bind "this" for all methods in constructors
    this.storeEditorElementRef = this.storeEditorElementRef.bind(this)
    this.handleFocusChange = this.handleFocusChange.bind(this)
    this.updateInputContent = this.updateInputContent.bind(this)
    this.storeEditorElementRef = this.storeEditorElementRef.bind(this)
    this.getReadOnly = this.getReadOnly.bind(this)
  }

  componentDidMount() {
    if (this.props.thisCellBeingEdited
      && this.refs.hasOwnProperty('editor') // eslint-disable-line
    ) {
      this.editor.focus()
    }
  }

  componentDidUpdate() {
    if (this.props.thisCellBeingEdited) {
      this.editor.focus()
    } else {
      this.editor.getCodeMirror().display.input.textarea.blur()
    }
  }

  getReadOnly() {
    if (this.props.viewMode === 'presentation') return true
    if (this.props.highlighted) return 'nocursor'
    return false
  }

  handleFocusChange(focused) {
    if (focused && this.props.viewMode === 'editor') {
      if (!this.props.thisCellBeingEdited) {
        this.props.actions.unHighlightCells()
        this.props.actions.selectCell(this.props.cellId)
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
    const editorOptions = Object.assign({}, {
      mode: this.props.languageIsAvailable ? this.props.codeMirrorMode : '',
      lineWrapping: false,
      matchBrackets: true,
      autoCloseBrackets: true,
      theme: 'eclipse',
      autoRefresh: true,
      lineNumbers: true,
      keyMap: 'sublime',
      extraKeys: {
        'Ctrl-Space': this.props.codeMirrorMode === 'javascript' ? this.autoComplete : undefined,
      },
      comment: this.props.codeMirrorMode === 'javascript',
      readOnly: this.getReadOnly(),
    }, this.props.editorOptions)

    return (
      <div
        className="editor"
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
  const languageModule = cell.language in state.languages ?
    state.languages[cell.language].module : null

  const codeMirrorMode = (
    cell.cellType === 'code' ? state.languages[cell.language].codeMirrorMode : cell.cellType
  )

  return {
    thisCellBeingEdited: cell.selected && state.mode === 'edit',
    viewMode: state.viewMode,
    cellType: cell.cellType,
    content: cell.content,
    highlighted: cell.highlighted,
    cellId,
    codeMirrorMode,
    languageIsAvailable: cell.cellType !== 'code' ? true : window[languageModule] !== undefined,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CellEditor)
