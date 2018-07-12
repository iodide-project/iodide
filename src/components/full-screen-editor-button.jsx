import React from 'react'
import { connect } from 'react-redux'
import EditorIcon from 'material-ui-icons/Code'
import EvalFrameIcon from 'material-ui-icons/InsertChart'
import EditorButton from './editor-button'
import tasks from '../actions/task-definitions'


export class FullScreenEditorButtonUnconnected extends React.Component {
  render() {
    return (
      <div
        className="display-buttons"
        style={{
        position: 'absolute',
        right: -25,
        top: 0,
        display: this.props.viewMode === 'REPORT_VIEW' ? 'none' : undefined,
      }}
      >
        <EditorButton
          name="editor"
          text={this.props.showEditor ? 'hide editor' : 'show editor'}
          isActive={this.props.showEditor}
          onClick={() => { tasks.toggleEditorVisibility.callback(); }}
        >
          <EditorIcon style={{ fontSize: '13px' }} />
        </EditorButton>
        <EditorButton
          text={this.props.showFrame ? 'hide eval frame' : 'show eval frame'}
          isActive={this.props.showFrame}
          onClick={() => { tasks.toggleEvalFrameVisibility.callback(); }}
        >
          <EvalFrameIcon style={{ fontSize: '13px' }} />
        </EditorButton>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    showFrame: state.showFrame,
    showEditor: state.showEditor,
    viewMode: state.viewMode,
  }
}

export default connect(mapStateToProps)(FullScreenEditorButtonUnconnected)
