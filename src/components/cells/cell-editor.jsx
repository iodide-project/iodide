import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types';

import ReactCodeMirror from '@skidding/react-codemirror'
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

class CellEditor extends React.Component {
  static propTypes = {
    // readOnly: PropTypes.bool.isRequired,
    cellId: PropTypes.number.isRequired,
    cellType: PropTypes.string,
    content: PropTypes.string,
    codeMirrorModeLoaded: PropTypes.bool,
    actions: PropTypes.shape({
      selectCell: PropTypes.func.isRequired,
      changeMode: PropTypes.func.isRequired,
      updateInputContent: PropTypes.func.isRequired,
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
  }

  componentDidMount() {
    if (this.props.thisCellBeingEdited
      && this.refs.hasOwnProperty('EXPLORE_VIEW') // eslint-disable-line
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

  handleFocusChange(focused) {
    if (focused) {
      if (!this.props.thisCellBeingEdited) {
        this.props.actions.selectCell(this.props.cellId)
        this.props.actions.changeMode('edit')
      }
    } else if (!focused) {
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
      mode: this.props.codeMirrorModeLoaded ? this.props.codeMirrorMode : '',
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
    }, this.props.editorOptions)

    return (
      <div
        className="editor"
        style={this.props.containerStyle}
      >
        <ReactCodeMirror
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
  let editorOptions
  switch (cell.cellType) {
    case 'code':
    case 'external dependencies':
    case 'css':
      editorOptions = {}
      break

    case 'markdown':
      editorOptions = {
        lineWrapping: true,
        matchBrackets: false,
        autoCloseBrackets: false,
        lineNumbers: false,
      }
      break

    case 'raw':
    case 'plugin':
      editorOptions = {
        matchBrackets: false,
        autoCloseBrackets: false,
      }
      break

    default:
      editorOptions = {}
  }

  const { codeMirrorModeLoaded } = state.languages[cell.language]

  const codeMirrorMode = (
    cell.cellType === 'code' ? state.languages[cell.language].codeMirrorMode : cell.cellType
  )

  return {
    thisCellBeingEdited: cell.selected && state.mode === 'edit',
    cellType: cell.cellType,
    content: cell.content,
    cellId,
    codeMirrorMode,
    codeMirrorModeLoaded,
    editorOptions,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CellEditor)
