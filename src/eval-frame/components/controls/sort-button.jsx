import React from 'react'
// import { connect } from 'react-redux'
import Sort from '@material-ui/icons/Sort'
// import SvgIcon from '@material-ui/core/SvgIcon'
import { EditorButton } from '../../../components/controls/editor-button'

// import tasks from '../../actions/eval-frame-tasks'

export default class SortButtonUnconnected extends React.Component {
  render() {
    return (
      <EditorButton
        text="Toggle output sorting"
        isActive
        onClick={this.props.task.callback}
      >
        <Sort style={{ fontSize: '13px' }} />
      </EditorButton>
    )
  }
}

// export function mapStateToProps(state, ownProps) {
//   // console.log('!!!', ownProps.task)
//   return {
//     // task: ownProps.task,
//     tooltipText: 'sort outputs placeholder',
//   }
// }

// export default connect(mapStateToProps)(SortButtonUnconnected)
