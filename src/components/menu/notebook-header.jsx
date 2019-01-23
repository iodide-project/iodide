import React from "react";

import PresentationModeToolbar from "./presentation-mode-toolbar";
import EditorModeToolbar from "./editor-mode-toolbar";

import HeaderMessages from "./header-messages";

import AppMessages from "../app-messages/app-messages";

import IodideModalsRoot from "../modals/iodide-modals-root";

export default class NotebookHeader extends React.Component {
  render() {
    return (
      <React.Fragment>
        <a id="export-anchor" style={{ display: "none" }} />
        <EditorModeToolbar />
        <HeaderMessages />
        <PresentationModeToolbar />
        <AppMessages />
        <IodideModalsRoot />
      </React.Fragment>
    );
  }
}
