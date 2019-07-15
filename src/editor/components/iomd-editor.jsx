import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import deepEqual from "deep-equal";

// eslint-disable-next-line import/first
// import MonacoEditor from "react-monaco-editor";

// import * as monaco from "monaco-editor";
/* eslint-disable import/first */
import "monaco-editor/esm/vs/editor/browser/controller/coreCommands";
import "monaco-editor/esm/vs/editor/contrib/find/findController";
import "monaco-editor/esm/vs/editor/contrib/multicursor/multicursor";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "./monaco-language-init";
// import "monaco-editor/esm/vs/language/typescript/monaco.contribution";
// import "monaco-editor/esm/vs/language/css/monaco.contribution";
// import "monaco-editor/esm/vs/language/json/monaco.contribution";
// import "monaco-editor/esm/vs/language/html/monaco.contribution";
// import "monaco-editor/esm/vs/basic-languages/python/python.contribution";
// import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution";
// import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
// import "monaco-editor/esm/vs/basic-languages/css/css.contribution";
// import { language as cssDef } from "monaco-editor/esm/vs/basic-languages/css/css";

// console.log({ cssDef });

import {
  updateIomdContent,
  updateEditorCursor,
  updateEditorSelections
} from "../actions/actions";
import { updateAutosave } from "../actions/autosave-actions";
/* eslint-enable import/first */

// eslint-disable-next-line no-restricted-globals

// window.MonacoEnvironment = {
//   baseUrl: "",
//   getWorker(moduleId, label) {
//     console.log("getWorker ####", { moduleId, label });
//   },
//   getWorkerUrl(moduleId, label) {
//     console.log("getWorkerUrl ####", { moduleId, label });
//     if (label === "json") {
//       return "monaco.json.worker.dev.js";
//     }
//     if (label === "css") {
//       return "monaco.css.worker.dev.js";
//     }
//     if (label === "html") {
//       return "monaco.html.worker.dev.js";
//     }
//     if (label === "typescript" || label === "javascript") {
//       return "monaco.ts.worker.dev.js";
//     }
//     return "smonaco.editor.worker.dev.js";
//   }
// };

// monaco.languages.register({ id: "iomd" });
// monaco.languages.setMonarchTokensProvider("iomd", iomdDefinition);

function unpackMonacoSelection(s, monacoModel) {
  return {
    start: { line: s.endLineNumber, col: s.endColumn },
    end: { line: s.startLineNumber, col: s.startColumn },
    selectedText: monacoModel.getValueInRange(s)
  };
}

class IomdEditorUnconnected extends React.Component {
  static propTypes = {
    content: PropTypes.string,
    wordWrap: PropTypes.string.isRequired,
    // editorOptions: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    editorCursorLine: PropTypes.number.isRequired,
    editorCursorCol: PropTypes.number.isRequired,
    editorPositionString: PropTypes.string.isRequired,
    // action creators
    updateIomdContent: PropTypes.func.isRequired,
    updateEditorCursor: PropTypes.func.isRequired,
    updateEditorSelections: PropTypes.func.isRequired,
    updateAutosave: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.containerDivRef = React.createRef();
    this.editor = null;

    // explicitly bind "this" for all methods in constructors
    this.handleEditorUpdate = this.handleEditorUpdate.bind(this);
  }

  componentDidMount() {
    this.editor = monaco.editor.create(this.containerDivRef.current, {
      value: this.props.content,
      language: "iomd",
      wordWrap: this.props.wordWrap
    });
    window.MONACO_EDITOR = this.editor;

    this.editor.onDidChangeModelContent(() => {
      this.handleEditorUpdate(this.editor.getValue());
    });
    this.editor.onDidChangeCursorPosition(() => {
      const { lineNumber, column } = this.editor.getPosition();
      this.props.updateEditorCursor(lineNumber, column);
    });
    this.editor.onDidChangeCursorSelection(event => {
      const { selection, secondarySelections } = event;

      if (selection.isEmpty()) {
        this.props.updateEditorSelections([]);
      } else {
        const model = this.editor.getModel();

        const selections = [
          unpackMonacoSelection(selection, model),
          ...secondarySelections.map(s => unpackMonacoSelection(s, model))
        ];
        this.props.updateEditorSelections(selections);
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps);
  }

  componentDidUpdate(prevProps) {
    const {
      editorCursorLine,
      editorCursorCol,
      content,
      wordWrap,
      editorPositionString
    } = this.props;
    const { lineNumber, column } = this.editor.getPosition();

    if (lineNumber !== editorCursorLine || column !== editorCursorCol) {
      this.editor.setPosition(
        new monaco.Position(editorCursorLine, editorCursorCol)
      );
    }

    if (content !== this.editor.getValue()) {
      this.editor.setValue(content);
    }

    if (editorPositionString !== prevProps.editorPositionString) {
      this.editor.layout();
    }

    this.editor.updateOptions({ wordWrap });
  }

  handleEditorUpdate(content) {
    this.props.updateIomdContent(content);
    this.props.updateAutosave();
  }

  render() {
    return (
      <div
        ref={this.containerDivRef}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }
}

function mapStateToProps(state) {
  // const editorOptions = {
  //   lineWrapping: false,
  //   matchBrackets: true,
  //   autoCloseBrackets: true,
  //   theme: "eclipse",
  //   autoRefresh: true,
  //   lineNumbers: true,
  //   keyMap: "sublime",
  //   comment: true,
  //   readOnly:
  //     state.notebookInfo && state.notebookInfo.revision_is_latest === false
  // };

  // if (state.wrapEditors === true) {
  //   editorOptions.lineWrapping = true;
  // }
  const wordWrap = state.wrapEditors ? "on" : "off";
  const { line: editorCursorLine, col: editorCursorCol } = state.editorCursor;

  // by passing in the following prop, we can ensure that the
  // Monaco instance does a fresh layout when the position
  // of it's containing pane changes
  const editorPositionString = Object.values(
    state.panePositions.EditorPositioner
  ).join(",");
  return {
    content: state.iomd,
    wordWrap,
    // editorOptions,
    editorCursorLine,
    editorCursorCol,
    editorPositionString
  };
}

const mapDispatchToProps = {
  updateIomdContent,
  updateEditorCursor,
  updateEditorSelections,
  updateAutosave
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IomdEditorUnconnected);
