import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import deepEqual from "deep-equal";

/* eslint-disable import/first */

// for all potential imports, see https://github.com/microsoft/monaco-editor-samples/blob/master/browser-esm-webpack-small/index.js
import "monaco-editor/esm/vs/editor/browser/controller/coreCommands";
import "monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations";
import "monaco-editor/esm/vs/editor/contrib/find/findController";
import "monaco-editor/esm/vs/editor/contrib/multicursor/multicursor";
import "monaco-editor/esm/vs/editor/contrib/folding/folding";
import "monaco-editor/esm/vs/editor/contrib/indentation/indentUtils";
import "monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching";
import "monaco-editor/esm/vs/editor/contrib/comment/comment";

// import 'monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget';
// import 'monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget';
// import 'monaco-editor/esm/vs/editor/browser/widget/diffNavigator';
// import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching';
// import 'monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations';
// import 'monaco-editor/esm/vs/editor/contrib/caretOperations/transpose';
// import 'monaco-editor/esm/vs/editor/contrib/clipboard/clipboard';
import "monaco-editor/esm/vs/editor/contrib/codelens/codelensController";
// import 'monaco-editor/esm/vs/editor/contrib/colorPicker/colorDetector';
// import 'monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu';
// import 'monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo';
// import 'monaco-editor/esm/vs/editor/contrib/dnd/dnd';
import "monaco-editor/esm/vs/editor/contrib/format/formatActions";
// import 'monaco-editor/esm/vs/editor/contrib/goToDeclaration/goToDeclarationCommands';
// import 'monaco-editor/esm/vs/editor/contrib/goToDeclaration/goToDeclarationMouse';
// import 'monaco-editor/esm/vs/editor/contrib/gotoError/gotoError';
import "monaco-editor/esm/vs/editor/contrib/hover/hover";
// import 'monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplace';
// import 'monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations';
// import 'monaco-editor/esm/vs/editor/contrib/links/links';
// import 'monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints';
// import 'monaco-editor/esm/vs/editor/contrib/quickFix/quickFixCommands';
// import 'monaco-editor/esm/vs/editor/contrib/referenceSearch/referenceSearch';
// import 'monaco-editor/esm/vs/editor/contrib/rename/rename';
// import 'monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect';
import "monaco-editor/esm/vs/editor/contrib/snippet/snippetController2";
import "monaco-editor/esm/vs/editor/contrib/suggest/suggestController";
// import 'monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode';
// import 'monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter';
// import 'monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations';
// import 'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp';
// import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens';
// import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickOutline';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/gotoLine';
// import 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickCommand';
// import 'monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast';

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "./monaco-language-init";
//
import "monaco-editor/esm/vs/language/css/monaco.contribution";

import "./monaco-custom-styles.css";
import { iomdTheme } from "../iomd-tools/iomd-monaco-theme";

import {
  updateIomdContent,
  updateEditorCursor,
  updateEditorSelections
} from "../actions/editor-actions";
import { updateAutosave } from "../actions/autosave-actions";

function unpackMonacoSelection(s, monacoModel) {
  return {
    start: { line: s.endLineNumber, col: s.endColumn },
    end: { line: s.startLineNumber, col: s.startColumn },
    selectedText: monacoModel.getValueInRange(s)
  };
}

const decorationsDontGrow =
  monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges;

let iomdDelimLineDecorationIds = [];

class IomdEditorUnconnected extends React.Component {
  static propTypes = {
    content: PropTypes.string,
    wordWrap: PropTypes.string.isRequired,
    editorCursorLine: PropTypes.number.isRequired,
    editorCursorCol: PropTypes.number.isRequired,
    editorPositionString: PropTypes.string.isRequired,
    delimLines: PropTypes.arrayOf(PropTypes.number),
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
    monaco.editor.defineTheme("iomdTheme", iomdTheme);

    this.editor = monaco.editor.create(this.containerDivRef.current, {
      value: this.props.content,
      language: "iomd",
      wordWrap: this.props.wordWrap,
      theme: "iomdTheme",
      autoIndent: true,
      autoSurround: true,
      formatOnType: true,
      wrappingIndent: "same",
      lineNumbersMinChars: 3,
      renderLineHighlight: "gutter",
      minimap: {
        enabled: false
      }
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

    const newDecorations = this.props.delimLines.map(delimLineNum => ({
      range: new monaco.Range(delimLineNum, 1, delimLineNum, 1),
      options: {
        isWholeLine: true,
        className: ".iomd-delim-line",
        stickiness: decorationsDontGrow
      }
    }));
    iomdDelimLineDecorationIds = this.editor.deltaDecorations(
      [],
      newDecorations
    );
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
      editorPositionString,
      delimLines
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

    if (delimLines.join(",") !== prevProps.delimLines.join(",")) {
      const newDecorations = delimLines.map(line => ({
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: ".iomd-delim-line",
          stickiness: decorationsDontGrow
        }
      }));
      this.editor.deltaDecorations(iomdDelimLineDecorationIds, newDecorations);
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
  const wordWrap = state.wrapEditors ? "on" : "off";
  const { line: editorCursorLine, col: editorCursorCol } = state.editorCursor;

  // by passing in the editorPositionString prop, we can ensure that the
  // Monaco instance does a fresh layout when the position
  // of it's containing pane changes. Slightly hacky but actually
  // works great.
  const editorPositionString = Object.values(
    state.panePositions.EditorPositioner
  ).join(",");

  const delimLines = state.iomdChunks.map(chunk => chunk.startLine);

  return {
    content: state.iomd,
    wordWrap,
    editorCursorLine,
    editorCursorCol,
    editorPositionString,
    delimLines
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
