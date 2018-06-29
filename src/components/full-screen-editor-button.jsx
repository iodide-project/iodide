import React from 'react'
import { connect } from 'react-redux'

import tasks from '../actions/task-definitions'

export class FullScreenEditorButtonUnconnected extends React.Component {
  render() {
    return (
      <button
        className="full-screen-editor-button"
        onClick={() => { tasks.toggleEvalFrameVisibility.callback(); }}
      >{this.props.showFrame ? '→' : '←'}
      </button>
    )
  }
}

function mapStateToProps(state) {
  return {
    showFrame: state.showFrame,
  }
}

export default connect(mapStateToProps)(FullScreenEditorButtonUnconnected)
