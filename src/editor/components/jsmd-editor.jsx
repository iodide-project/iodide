import React from "react";
import { connect } from "react-redux";
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

import {
  updateJsmdContent,
  updateEditorCursor,
  updateEditorSelections
} from "../actions/actions";
import { updateAutosave } from "../actions/autosave-actions";
import { postMessageToEvalFrame } from "../port-to-eval-frame";
import { getAllSelections } from "./codemirror-utils";

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
    editorOptions: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    editorCursorLine: PropTypes.number.isRequired,
    editorCursorCol: PropTypes.number.isRequired,
    editorCursorForceUpdate: PropTypes.bool.isRequired,
    // action creators
    updateJsmdContent: PropTypes.func.isRequired,
    updateEditorCursor: PropTypes.func.isRequired,
    updateEditorSelections: PropTypes.func.isRequired
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
    if (this.props.editorCursorForceUpdate) {
      this.editor.setCursor(
        this.props.editorCursorLine,
        this.props.editorCursorCol
      );
    }
  }

  storeEditorInstance(editor) {
    this.editor = editor;
  }

  updateJsmdContent(editor, data, content) {
    this.props.updateJsmdContent(content);
  }

  updateCursor(editor) {
    const { line, ch } = editor.getCursor();
    this.props.updateEditorCursor(line, ch);
    const selections = editor.somethingSelected()
      ? getAllSelections(editor.getDoc())
      : [];
    this.props.updateEditorSelections(selections);
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
    // FIXME: restore autocomplete to working order
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

    const { editorCursorLine, editorCursorCol } = this.props;
    return (
      <ReactCodeMirror
        editorDidMount={this.storeEditorInstance}
        cursor={{ line: editorCursorLine, ch: editorCursorCol }}
        value={this.props.content}
        options={this.props.editorOptions}
        onBeforeChange={this.updateJsmdContent}
        onCursorActivity={this.updateCursor}
        style={{ height: "100%" }}
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
  const {
    line: editorCursorLine,
    col: editorCursorCol,
    forceUpdate: editorCursorForceUpdate
  } = state.editorCursor;
  return {
    content: state.jsmd,
    editorOptions,
    editorCursorLine,
    editorCursorCol,
    editorCursorForceUpdate
  };
}

// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(actions, dispatch)
//   };
// }
export function mapDispatchToProps(dispatch) {
  return {
    updateJsmdContent: content => {
      dispatch(updateJsmdContent(content));
      dispatch(updateAutosave());
    },
    updateEditorCursor: (line, col) => dispatch(updateEditorCursor(line, col)),
    updateEditorSelections: selections =>
      dispatch(updateEditorSelections(selections))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JsmdEditorUnconnected);
