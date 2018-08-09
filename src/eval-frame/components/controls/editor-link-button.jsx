import React from 'react'
import { connect } from 'react-redux'
import LinkIcon from '@material-ui/icons/Link'
import SvgIcon from '@material-ui/core/SvgIcon'
import { EditorButton } from '../../../components/controls/editor-button'

import tasks from '../../actions/eval-frame-tasks'

const UnlinkIcon = props => (
  <SvgIcon {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4L20 19.74 3.27 3 2 4.27z" />
      <path fill="none" d="M0 24V0" />
    </svg>
  </SvgIcon>
)

export const ACTIVE_SCROLLING_TEXT = 'link to editor cell selection'
export const INACTIVE_SCROLLING_TEXT = 'unlink from editor cell selection'

export class EditorLinkButtonUnconnected extends React.Component {
  render() {
    return (
      <EditorButton
        text={this.props.tooltipText}
        isActive={this.props.scrollingLinked}
        style={{
            borderBottomRightRadius: 3,
        }}
        onClick={tasks.toggleEditorLink.callback}
      >
        {this.props.scrollingLinked ? <LinkIcon style={{ fontSize: '13px' }} /> : <UnlinkIcon style={{ fontSize: '13px' }} />}
      </EditorButton>
    )
  }
}

export function mapStateToProps(state) {
  return {
    scrollingLinked: state.scrollingLinked,
    tooltipText: state.scrollingLinked ? ACTIVE_SCROLLING_TEXT : INACTIVE_SCROLLING_TEXT,
  }
}

export default connect(mapStateToProps)(EditorLinkButtonUnconnected)
