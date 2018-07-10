import React from 'react'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import PresentationModeToolbar from './presentation-mode-toolbar'
import EditorModeToolbar from './editor-mode-toolbar'

import AppMessages from '../app-messages/app-messages'
import FullScreenEditorButton from '../full-screen-editor-button'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
})

export default class NotebookHeader extends React.Component {
  render() {
    return (
      <div className="notebook-header">
        <a id="export-anchor" style={{ display: 'none' }} />
        <MuiThemeProvider theme={theme}>
          <EditorModeToolbar />
        </MuiThemeProvider>
        <FullScreenEditorButton />
        <PresentationModeToolbar />
        <AppMessages />
      </div>
    )
  }
}
