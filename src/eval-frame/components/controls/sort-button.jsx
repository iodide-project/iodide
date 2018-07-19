import React from 'react'
import { connect } from 'react-redux'
import Sort from '@material-ui/icons/Sort'
// import SvgIcon from '@material-ui/core/SvgIcon'
import { EditorButton } from '../../../components/controls/editor-button'

import tasks from '../../actions/eval-frame-tasks'

export const ACTIVE_SCROLLING_TEXT = 'unscroll w/ editor'
export const INACTIVE_SCROLLING_TEXT = 'scroll w/ editor'

export class SortButtonUnconnected extends React.Component {
  render() {
    return (
      <EditorButton
        text={this.props.tooltipText}
        isActive
        onClick={tasks.toggleEditorLink.callback}
      >
        <Sort style={{ fontSize: '13px' }} />
      </EditorButton>
    )
  }
}

export function mapStateToProps() {
  return {
    tooltipText: 'sort outputs placeholder',
  }
}

export default connect(mapStateToProps)(SortButtonUnconnected)
