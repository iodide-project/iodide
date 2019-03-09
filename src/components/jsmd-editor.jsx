import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import deepEqual from "deep-equal";

import { Controlled as ReactCodeMirror } from "react-codemirror2";

import CodeMirror from "codemirror";

import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/display/autorefresh";
import "codemirror/addon/comment/comment";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/keymap/sublime";

import "./codemirror-fetch-mode";
import "./codemirror-jsmd-mode";

import * as actions from "../actions/actions";
import { postMessageToEvalFrame } from "../port-to-eval-frame";

// unmap keys that conflict with our keys
// mac
delete CodeMirror.keyMap.sublime["Cmd-Enter"];
delete CodeMirror.keyMap.sublime["Shift-Cmd-Enter"];
// pc/linux
delete CodeMirror.keyMap.sublime["Ctrl-Enter"];
delete CodeMirror.keyMap.sublime["Shift-Ctrl-Enter"];

class JsmdEditorUnconnected extends React.Component {
  static propTypes = {
    content: PropTypes.string,
    actions: PropTypes.shape({
      updateJsmdContent: PropTypes.func.isRequired
    }).isRequired,
    containerStyle: PropTypes.object,
    editorOptions: PropTypes.object
  };

  constructor(props) {
    super(props);
    // explicitly bind "this" for all methods in constructors
    this.updateJsmdContent = this.updateJsmdContent.bind(this);
    this.updateCursor = this.updateCursor.bind(this);
    this.storeEditorInstance = this.storeEditorInstance.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }

  componentDidUpdate() {
    // need to
    // const cm = this.editor;
    // const { editorCursorLine, editorCursorChar } = this.props;
    // if (
    //   cm.getCursor().line !== editorCursorLine ||
    //   cm.getCursor().ch !== editorCursorChar
    // ) {
    //   console.warn("CURSOR DIRTY +++++++++++++++++++");
    //   // cm.setCursor(editorCursorLine, editorCursorChar);
    // }

    const cm = this.editor;
    const {
      editorCursorLine,
      editorCursorChar,
      editorCursorForceUpdate
    } = this.props;
    if (editorCursorForceUpdate) {
      console.warn("CURSOR DIRTY +++++++++++++++++++");
      cm.setCursor(editorCursorLine, editorCursorChar);
    }
  }

  storeEditorInstance(editor) {
    this.editor = editor;
    window.ACTIVE_CODEMIRROR = editor;
  }

  updateJsmdContent(editor, data, content) {
    // const { line, ch } = editor.getCursor();
    // this.props.actions.updateEditorCursor(line, ch);
    this.props.actions.updateJsmdContent(content);
  }

  updateCursor(editor) {
    // console.log("editor, data", editor, data);
    // console.log("editor.getCursor()", editor.getCursor());
    const { line, ch } = editor.getCursor();
    this.props.actions.updateEditorCursor(line, ch);
  }

  autoComplete = cm => {
    // this is ported directly from CodeMirror's javascript-hint.
    // we are splitting the functionality of that module so we can run half
    // in the editor (the CodeMirror tokenization) and the other half in the eval-frame
    // (the completion list generation).
    window.ACTIVE_EDITOR_REF = cm;
    let context = [];
    const codeMirror = this.editor.getCodeMirrorInstance();
    const { Pos } = codeMirror;
    const cur = cm.getCursor();
    const getToken = (editor, cursor) => editor.getTokenAt(cursor);
    let token = getToken(cm, cur);
    const innerMode = codeMirror.innerMode(cm.getMode(), token.state);
    if (innerMode.mode.helperType === "json") return;
    token.state = innerMode.state;

    // If it's not a 'word-style' token, ignore the token.
    if (!/^[\w$_]*$/.test(token.string)) {
      token = {
        start: cur.ch,
        end: cur.ch,
        string: "",
        state: token.state,
        type: token.string === "." ? "property" : null
      };
    } else if (token.end > cur.ch) {
      token.end = cur.ch;
      token.string = token.string.slice(0, cur.ch - token.start);
    }

    let tprop = token;
    // If it is a property, find out what it is a property of.
    while (tprop.type === "property") {
      tprop = getToken(cm, Pos(cur.line, tprop.start));
      if (tprop.string !== ".") return; // don't do anything.
      tprop = getToken(cm, Pos(cur.line, tprop.start));
      if (!context) context = [];
      context.push(tprop);
    }

    // remove all functions to allow message passing to eval-frame.
    token.state.tokenize = undefined;
    delete token.state.cc;
    context.forEach(c => {
      const cc = c;
      cc.state.tokenize = undefined;
      delete cc.state.cc;
    });

    const from = Pos(cur.line, token.start);
    const to = Pos(cur.line, token.end);

    // the eval-frame, after receiving this message,
    // generates the completion suggestions and sends back
    // to be rendered by the CodeMirror instsance saved in
    // window.ACTIVE_EDITOR_REF.
    // After the .showHint function is called, we set window.ACTIVE_EDITOR_REF = undefined.
    postMessageToEvalFrame("REQUEST_AUTOCOMPLETE_SUGGESTIONS", {
      token,
      context,
      from,
      to
    });
  };

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

    // const { editorCursorLine, editorCursorChar } = this.props;
    return (
      <ReactCodeMirror
        editorDidMount={this.storeEditorInstance}
        // cursor={{ line: editorCursorLine, ch: editorCursorChar }}
        value={this.props.content}
        options={this.props.editorOptions}
        onBeforeChange={this.updateJsmdContent}
        onCursorActivity={this.updateCursor}
        style={{ height: "100%" }}
        // autoCursor={false}
      />
    );
  }
}

function mapStateToProps(state) {
  const codeMirrorMode = "jsmd";
  const editorOptions = {
    mode: codeMirrorMode,
    lineWrapping: false,
    matchBrackets: true,
    autoCloseBrackets: true,
    theme: "eclipse",
    autoRefresh: true,
    lineNumbers: true,
    keyMap: "sublime",
    comment: true
  };

  if (state.wrapEditors === true) {
    editorOptions.lineWrapping = true;
  }
  const { editorCursorLine, editorCursorChar, editorCursorForceUpdate } = state;
  return {
    content: state.jsmd,
    editorOptions,
    editorCursorLine,
    editorCursorChar,
    editorCursorForceUpdate
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JsmdEditorUnconnected);
