import React from 'react'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import PresentationModeToolbar from './toolbar/presentation-mode-toolbar'
import EditorModeToolbar from './toolbar/editor-mode-toolbar'


import DeclaredVariablesPane from './toolbar/declared-variables-pane'
import HistoryPane from './toolbar/history-pane'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
})

export default class NotebookHeader extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="notebook-header">
          <a id="export-anchor" style={{ display: 'none' }} />
          <EditorModeToolbar />
          <PresentationModeToolbar />
          <DeclaredVariablesPane />
          <HistoryPane />
        </div>
      </MuiThemeProvider>
    )
  }
}
