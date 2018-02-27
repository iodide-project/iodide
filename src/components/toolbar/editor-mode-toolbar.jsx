import React from 'react'

import { Toolbar } from 'material-ui/Toolbar'

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import EditorModeMenu from './editor-mode-menu'
import ViewControls from './view-controls'

import EditorModeTitle from './editor-mode-title'

class EditorModeToolbar extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <Toolbar style={{ backgroundColor: 'black' }}>
          <EditorModeMenu isFirstChild />
          <EditorModeTitle />
          <ViewControls />
        </Toolbar>
      </MuiThemeProvider>
    )
  }
}

export default EditorModeToolbar
