import React from "react";
import PropTypes from "prop-types";

/* eslint-disable import/first */

// for all potential imports, see https://github.com/microsoft/monaco-editor-samples/blob/master/browser-esm-webpack-small/index.js
import "monaco-editor/esm/vs/editor/browser/controller/coreCommands";
import "monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget";
import "monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations";
import "monaco-editor/esm/vs/editor/contrib/find/findController";
import "monaco-editor/esm/vs/editor/contrib/multicursor/multicursor";
import "monaco-editor/esm/vs/editor/contrib/folding/folding";
import "monaco-editor/esm/vs/editor/contrib/indentation/indentUtils";
import "monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching";
import "monaco-editor/esm/vs/editor/contrib/comment/comment";
import "monaco-editor/esm/vs/editor/contrib/snippet/snippetController2";
import "monaco-editor/esm/vs/editor/contrib/suggest/suggestController";
import "monaco-editor/esm/vs/editor/contrib/codelens/codelensController";
import "monaco-editor/esm/vs/editor/contrib/format/formatActions";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "../iomd-editor/monaco-language-init";

import { iomdTheme } from "../iomd-editor/iomd-monaco-theme";
import "../iomd-editor/monaco-custom-styles.css";

export class RevisionDiffContent extends React.Component {
  static propTypes = {
    original: PropTypes.string,
    modified: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.containerDivRef = React.createRef();
  }

  componentDidMount() {
    const { original, modified } = this.props;

    monaco.editor.defineTheme("iomdTheme", iomdTheme);

    this.editor = monaco.editor.createDiffEditor(this.containerDivRef.current, {
      enableSplitViewResizing: false,
      renderSideBySide: false,
      language: "text/plain",
      theme: "iomdTheme"
    });

    this.editor.setModel({
      original: monaco.editor.createModel(original, "text/plain"),
      modified: monaco.editor.createModel(modified, "text/plain")
    });
  }

  componentDidUpdate() {
    const { original, modified } = this.props;

    this.editor.getModel().original.setValue(original);
    this.editor.getModel().modified.setValue(modified);

    this.editor.layout();
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
