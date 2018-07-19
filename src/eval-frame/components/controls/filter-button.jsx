import React from 'react'
// import { connect } from 'react-redux'
import FilterList from '@material-ui/icons/FilterList'
// import SvgIcon from '@material-ui/core/SvgIcon'
import { EditorButton } from '../../../components/controls/editor-button'

// import tasks from '../../actions/eval-frame-tasks'

export default class FilterButtonUnconnected extends React.Component {
  render() {
    return (
      <EditorButton
        text="Toggle output visibility"
        isActive
        onClick={this.props.task.callback}
      >
        <FilterList style={{ fontSize: '13px' }} />
      </EditorButton>
    )
  }
}

// export function mapStateToProps() {
//   return {
//     tooltipText: 'filter list placeholder',
//   }
// }

// export default connect(mapStateToProps)(FilterButtonUnconnected)
