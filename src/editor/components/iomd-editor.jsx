import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import deepEqual from "deep-equal";

import "./monaco-env-init";
// eslint-disable-next-line import/first
// import MonacoEditor from "react-monaco-editor";

// import * as monaco from "monaco-editor";
/* eslint-disable import/first */
import "monaco-editor/esm/vs/editor/browser/controller/coreCommands";
import "monaco-editor/esm/vs/editor/contrib/find/findController";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/basic-languages/python/python.contribution";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
/* eslint-enable import/first */

import {
  updateIomdContent,
  updateEditorCursor,
  updateEditorSelections
} from "../actions/actions";

class IomdEditorUnconnected extends React.Component {
  static propTypes = {
    content: PropTypes.string,
    editorOptions: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    editorCursorLine: PropTypes.number.isRequired,
    editorCursorCol: PropTypes.number.isRequired,
    editorCursorForceUpdate: PropTypes.bool.isRequired,
    // action creators
    updateIomdContent: PropTypes.func.isRequired,
    updateEditorCursor: PropTypes.func.isRequired,
    updateEditorSelections: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.containerDivRef = React.createRef();
    this.monacoRef = React.createRef();
    this.editor = null;

    // explicitly bind "this" for all methods in constructors
    this.updateIomdContent = this.updateIomdContent.bind(this);
    this.updateCursor = this.updateCursor.bind(this);
    this.storeEditorInstance = this.storeEditorInstance.bind(this);
  }

  componentDidMount() {
    console.log("this.containerDivRef.current", this.containerDivRef.current);
    console.log(
      "monaco ==================\n",
      monaco,
      "\n===================="
    );
    this.editor = monaco.editor.create(
      document.getElementById("monacoContainer"),
      // this.containerDivRef.current,
      {
        value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join(
          "\n"
        ),
        language: "javascript"
      }
    );
    this.editor.layout();
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }

  componentDidUpdate() {
    console.log("IOMD componentDidUpdate", this.editor);
    this.editor.layout();
    if (this.props.editorCursorForceUpdate) {
      this.editor.setCursor(
        this.props.editorCursorLine,
        this.props.editorCursorCol
      );
    }
  }

  storeEditorInstance(editor, monacoInstance) {
    console.log("editorDidMount", editor, monacoInstance);
    editor.focus();
    editor.layout();
    console.log("this.monacoRef", this.monacoRef);
    this.editor = editor;
  }

  updateIomdContent(editor, data, content) {
    this.props.updateIomdContent(content);
  }

  updateCursor(editor) {
    const { line, ch } = editor.getCursor();
    this.props.updateEditorCursor(line, ch);
    const selections = editor.somethingSelected();
    // ? getAllSelections(editor.getDoc())
    // : [];
    this.props.updateEditorSelections(selections);
  }

  render() {
    return (
      <div
        id="monacoContainer"
        ref={this.containerDivRef}
        style={{ width: "100%", height: "100%" }}
      />
    );
    // return (
    //   <MonacoEditor
    //     width="100%"
    //     height="100%"
    //     language="javascript"
    //     theme="vs-light"
    //     value={this.props.content}
    //     // onChange={this.updateIomdContent}
    //     ref={this.monacoRef}
    //     editorDidMount={this.storeEditorInstance}
    //   />
    // );
  }
}

function mapStateToProps(state) {
  const codeMirrorMode = "iomd";
  const editorOptions = {
    mode: codeMirrorMode,
    lineWrapping: false,
    matchBrackets: true,
    autoCloseBrackets: true,
    theme: "eclipse",
    autoRefresh: true,
    lineNumbers: true,
    keyMap: "sublime",
    comment: true,
    readOnly:
      state.notebookInfo && state.notebookInfo.revision_is_latest === false
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
    content: state.iomd,
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
    updateIomdContent: content => dispatch(updateIomdContent(content)),
    updateEditorCursor: (line, col) => dispatch(updateEditorCursor(line, col)),
    updateEditorSelections: selections =>
      dispatch(updateEditorSelections(selections))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IomdEditorUnconnected);
