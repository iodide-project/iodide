import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import deepEqual from "deep-equal";

import MonacoEditor from "react-monaco-editor";

import {
  updateJsmdContent,
  updateEditorCursor,
  updateEditorSelections
} from "../actions/actions";

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
    const selections = editor.somethingSelected();
    // ? getAllSelections(editor.getDoc())
    // : [];
    this.props.updateEditorSelections(selections);
  }

  render() {
    // const { editorCursorLine, editorCursorCol } = this.props;
    return (
      <MonacoEditor
        language="javascript"
        theme="vs-dark"
        value={this.props.content}
        onChange={this.updateJsmdContent}
        editorDidMount={this.storeEditorInstance}
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
    updateJsmdContent: content => dispatch(updateJsmdContent(content)),
    updateEditorCursor: (line, col) => dispatch(updateEditorCursor(line, col)),
    updateEditorSelections: selections =>
      dispatch(updateEditorSelections(selections))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JsmdEditorUnconnected);
