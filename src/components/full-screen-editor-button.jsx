import React from 'react'
import { connect } from 'react-redux'
import Tooltip from 'material-ui/Tooltip'
import EditorIcon from 'material-ui-icons/Code'
import EvalFrameIcon from 'material-ui-icons/InsertChart'
import LinkIcon from 'material-ui-icons/Link'
import SvgIcon from 'material-ui/SvgIcon'
import tasks from '../actions/task-definitions'

const UnlinkIcon = props => (
  <SvgIcon {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4L20 19.74 3.27 3 2 4.27z" />
      <path fill="none" d="M0 24V0" />
    </svg>
  </SvgIcon>
)

const EditorButton = props => (
  <Tooltip classes={{ tooltip: 'iodide-tooltip' }} title={props.text}>
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
        <EditorButton
          text={this.props.linkEditor ? 'unscroll w/ editor' : 'scroll w/ editor'}
          isActive={this.props.linkEditor}
          onClick={() => { tasks.toggleEditorLink.callback(); }}
        >
          {this.props.linkEditor ? <UnlinkIcon style={{ fontSize: '13px' }} /> : <LinkIcon style={{ fontSize: '13px' }} />}
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
