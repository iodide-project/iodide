import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import PresentationModeToolbar from "./presentation-mode-toolbar";
import EditorModeToolbar from "./editor-mode-toolbar";

import HeaderMessages from "./header-messages";

import AppMessages from "../app-messages/app-messages";

import IodideModalsRoot from "../modals/iodide-modals-root";

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

export default class NotebookHeader extends React.Component {
  render() {
    return (
      <React.Fragment>
        <a id="export-anchor" style={{ display: "none" }} />
        <div className="notebook-header">
          <MuiThemeProvider theme={theme}>
            <EditorModeToolbar />
          </MuiThemeProvider>
          <HeaderMessages />
          <PresentationModeToolbar />
          <AppMessages />
        </div>
        <IodideModalsRoot />
      </React.Fragment>
    );
  }
}
