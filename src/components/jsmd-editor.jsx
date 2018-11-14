import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import deepEqual from 'deep-equal'

import ReactCodeMirror from '@skidding/react-codemirror'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/css/css'
import 'codemirror/mode/htmlmixed/htmlmixed'

import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/display/autorefresh'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'

import '../codemirror-keymap-sublime'
import './codemirror-fetch-mode'
import './codemirror-jsmd-mode'

import * as actions from '../actions/actions'
import { postMessageToEvalFrame } from '../port-to-eval-frame'

class JsmdEditorUnconnected extends React.Component {
  static propTypes = {
    content: PropTypes.string,
    actions: PropTypes.shape({
      updateJsmdContent: PropTypes.func.isRequired,
    }).isRequired,
    containerStyle: PropTypes.object,
    editorOptions: PropTypes.object,
  }

  constructor(props) {
    super(props)
    // explicitly bind "this" for all methods in constructors
    // this.handleFocusChange = this.handleFocusChange.bind(this)
    this.updateJsmdContent = this.updateJsmdContent.bind(this)
    this.storeEditorElementRef = this.storeEditorElementRef.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps)
  }

  storeEditorElementRef(editorElt) {
    this.editor = editorElt
    window.ACTIVE_CODEMIRROR = editorElt.getCodeMirror()
    // pass this cm instance ref up to the parent cell with this callback
  }

  updateJsmdContent(content) {
    this.props.actions.updateJsmdContent(content)
  }

  autoComplete = (cm) => {
    // this is ported directly from CodeMirror's javascript-hint.
    // we are splitting the functionality of that module so we can run half
    // in the editor (the CodeMirror tokenization) and the other half in the eval-frame
    // (the completion list generation).
    window.ACTIVE_EDITOR_REF = cm
    let context = []
    const codeMirror = this.editor.getCodeMirrorInstance()
    const { Pos } = codeMirror
    const cur = cm.getCursor()
    const getToken = (editor, cursor) => editor.getTokenAt(cursor)
    let token = getToken(cm, cur)
    const innerMode = codeMirror.innerMode(cm.getMode(), token.state);
    if (innerMode.mode.helperType === 'json') return;
    token.state = innerMode.state;

    // If it's not a 'word-style' token, ignore the token.
    if (!/^[\w$_]*$/.test(token.string)) {
      token = {
        start: cur.ch,
        end: cur.ch,
        string: '',
        state: token.state,
        type: token.string === '.' ? 'property' : null,
      };
    } else if (token.end > cur.ch) {
      token.end = cur.ch;
      token.string = token.string.slice(0, cur.ch - token.start);
    }

    let tprop = token;
    // If it is a property, find out what it is a property of.
    while (tprop.type === 'property') {
      tprop = getToken(cm, Pos(cur.line, tprop.start));
      if (tprop.string !== '.') return // don't do anything.
      tprop = getToken(cm, Pos(cur.line, tprop.start));
      if (!context) context = [];
      context.push(tprop);
    }

    // remove all functions to allow message passing to eval-frame.
    token.state.tokenize = undefined
    delete token.state.cc
    context.forEach((c) => {
      const cc = c
      cc.state.tokenize = undefined
      delete cc.state.cc
    })

    const from = Pos(cur.line, token.start)
    const to = Pos(cur.line, token.end)

    // the eval-frame, after receiving this message,
    // generates the completion suggestions and sends back
    // to be rendered by the CodeMirror instsance saved in
    // window.ACTIVE_EDITOR_REF.
    // After the .showHint function is called, we set window.ACTIVE_EDITOR_REF = undefined.
    postMessageToEvalFrame('REQUEST_AUTOCOMPLETE_SUGGESTIONS', {
      token, context, from, to,
    })
  }

  render() {
    // const editorOptions = Object.assign(
    //   {},
    //   this.props.editorOptions,
    //   {
    //     extraKeys: {
    //       'Ctrl-Space': this.props.codeMirrorMode === 'javascript' ?
    // this.autoComplete : undefined,
    //     },
    //   },
    // )

    return (
      <ReactCodeMirror
        ref={this.storeEditorElementRef}
        value={this.props.content}
        options={this.props.editorOptions}
        onChange={this.updateJsmdContent}
        style={{ height: '100%' }}
      />
    )
  }
}


function mapStateToProps(state) {
  const codeMirrorMode = 'jsmd'
  const editorOptions = {
    mode: codeMirrorMode,
    lineWrapping: false,
    matchBrackets: true,
    autoCloseBrackets: true,
    theme: 'eclipse',
    autoRefresh: true,
    lineNumbers: true,
    keyMap: 'sublime',
    comment: true,
    // readOnly: cell.highlighted ? 'nocursor' : false,
  }

  if (state.wrapEditors === true) { editorOptions.lineWrapping = true }

  return {
    content: state.jsmd,
    editorOptions,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JsmdEditorUnconnected)
