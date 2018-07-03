import React from 'react'
import { connect } from 'react-redux'
import Tooltip from 'material-ui/Tooltip'
import EditorIcon from 'material-ui-icons/Code'
import EvalFrameIcon from 'material-ui-icons/InsertChart'
import LinkIcon from 'material-ui-icons/Link'
import tasks from '../actions/task-definitions'

const EditorButton = props => (
  <Tooltip classes={{ tooltip: 'iodide-tooltip' }} title={`${props.isActive ? 'hide' : 'show'} ${props.name}`}>
    <button
      className={`display-button ${props.isActive ? 'is-active' : ''}`}
      onClick={props.onClick}
    >{props.children}
    </button>
  </Tooltip>)

export class FullScreenEditorButtonUnconnected extends React.Component {
  render() {
    return (
      <div
        className="display-buttons"
        style={{
        display: this.props.viewMode === 'presentation' ? 'none' : undefined,
      }}
      >
        <EditorButton name="editor" isActive={this.props.showEditor} onClick={() => { tasks.toggleEditorVisibility.callback(); }}>
          <EditorIcon style={{ fontSize: '13px' }} />
        </EditorButton>
        <EditorButton name="eval frame" isActive={this.props.showFrame} onClick={() => { tasks.toggleEvalFrameVisibility.callback(); }}>
          <EvalFrameIcon style={{ fontSize: '13px' }} />
        </EditorButton>
        <EditorButton name="link editor" isActive={this.props.linkEditor} onClick={() => { tasks.toggleEditorLink.callback(); }}>
          <LinkIcon style={{ fontSize: '13px' }} />
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
    linkEditor: state.linkEditor,
  }
}

export default connect(mapStateToProps)(FullScreenEditorButtonUnconnected)
