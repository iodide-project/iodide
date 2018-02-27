import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Toolbar } from 'material-ui/Toolbar'

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import EditorModeControls from './editor-mode-controls'
import ViewControls from './view-controls'

import EditorModeTitle from './editor-mode-title'

export class EditorModeToolbarUnconnected extends React.Component {
  static propTypes = {
    viewMode: PropTypes.string,
  }
  render() {
    return (
      <div className="notebook-menu" style={{ display: this.props.viewMode === 'editor' ? 'block' : 'none' }}>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <Toolbar style={{ backgroundColor: 'black' }}>
            <EditorModeControls isFirstChild />
            <EditorModeTitle />
            <ViewControls />
          </Toolbar>
        </MuiThemeProvider>
      </div>

    )
  }
}

export function mapStateToProps(state) {
  return { viewMode: state.viewMode }
}

export default connect(mapStateToProps)(EditorModeToolbarUnconnected)
