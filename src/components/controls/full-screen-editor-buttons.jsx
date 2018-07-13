import React from 'react'
import { connect } from 'react-redux'
import EditorIcon from '@material-ui/icons/Code'
import EvalFrameIcon from '@material-ui/icons/InsertChart'
import { EditorButton } from './editor-button'
import tasks from '../../actions/task-definitions'


export class FullScreenEditorButtonUnconnected extends React.Component {
  render() {
    return (
      <div
        className="full-screen-editor-buttons"
        style={{ display: this.props.display }}
      >
        <EditorButton
          name="editor"
          text={this.props.showEditor ? 'hide editor' : 'show editor'}
          isActive={this.props.showEditor}
          onClick={this.props.toggleEditorVisibility}
        >
          <EditorIcon style={{ fontSize: '13px' }} />
        </EditorButton>
        <EditorButton
          text={this.props.showFrame ? 'hide eval frame' : 'show eval frame'}
          isActive={this.props.showFrame}
          onClick={this.props.toggleEvalFrameVisibility}
        >
          <EvalFrameIcon style={{ fontSize: '13px' }} />
        </EditorButton>

      </div>
    )
  }
}

export const VIEWMODE_IS_REPORT = 'none'
export const VIEWMODE_IS_NOT_REPORT = undefined

export function mapStateToProps(state) {
  return {
    showFrame: state.showFrame,
    showEditor: state.showEditor,
    viewMode: state.viewMode,
    display: state.viewMode === 'REPORT_VIEW' ? VIEWMODE_IS_REPORT : VIEWMODE_IS_NOT_REPORT,
    toggleEditorVisibility: tasks.toggleEditorVisibility.callback,
    toggleEvalFrameVisibility: tasks.toggleEvalFrameVisibility.callback,
  }
}

export default connect(mapStateToProps)(FullScreenEditorButtonUnconnected)
