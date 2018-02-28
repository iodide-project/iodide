import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import Toolbar from 'material-ui/Toolbar'
// import AppBar from 'material-ui/AppBar'
import EditorModeControls from './editor-mode-controls'
import ViewControls from './view-controls'

import EditorModeTitle from './editor-mode-title'
//
export class EditorModeToolbarUnconnected extends React.Component {
  static propTypes = {
    viewMode: PropTypes.string,
  }
  render() {
    return (
      <div
        className="notebook-menu"
        style={{ backgroundColor: 'black', height: '64px', display: this.props.viewMode === 'editor' ? 'block' : 'none' }}
      >
        <Toolbar desktop>
          <EditorModeControls isFirstChild />
          <EditorModeTitle />
          <ViewControls />
        </Toolbar>
      </div>

    )
  }
}

export function mapStateToProps(state) {
  return { viewMode: state.viewMode }
}

const EditorModeToolbar = connect(mapStateToProps)(EditorModeToolbarUnconnected)
export default EditorModeToolbar
