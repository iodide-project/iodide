import React from 'react'
import { connect } from 'react-redux'
import Tooltip from 'material-ui/Tooltip'

import tasks from '../actions/task-definitions'

export class FullScreenEditorButtonUnconnected extends React.Component {
  render() {
    return (
      <Tooltip classes={{ tooltip: 'iodide-tooltip' }} title="full width editor">
        <button
          className="full-screen-editor-button"
          onClick={() => { tasks.toggleEvalFrameVisibility.callback(); }}
        >{this.props.showFrame ? '→' : '←'}
        </button>
      </Tooltip>
    )
  }
}

function mapStateToProps(state) {
  return {
    showFrame: state.showFrame,
  }
}

export default connect(mapStateToProps)(FullScreenEditorButtonUnconnected)
