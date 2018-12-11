import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import PresentationModeToolbar from './presentation-mode-toolbar'
import EditorModeToolbar from './editor-mode-toolbar'

import HeaderMessages from './header-messages'

import AppMessages from '../app-messages/app-messages'

import IodideModalsRoot from '../modals/iodide-modals-root'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    suppressDeprecationWarnings: true,
  },
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
        <HeaderMessages />
        <PresentationModeToolbar />
        <AppMessages />
        <IodideModalsRoot />
      </div>
    )
  }
}
