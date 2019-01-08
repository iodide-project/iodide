import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import tasks from '../../actions/task-definitions'

export class ViewModeToggleButtonUnconnected extends React.Component {
  static propTypes = {
    viewMode: PropTypes.oneOf(['EXPLORE_VIEW', 'REPORT_VIEW']),
    textColor: PropTypes.string,
    hoverColor: PropTypes.string,
  }
  constructor(props) {
    super(props)
    this.toggleViewMode = this.toggleViewMode.bind(this)
  }

  toggleViewMode() {
    if (this.props.viewMode === 'REPORT_VIEW') {
      tasks.setViewModeToEditor.callback()
    } else if (this.props.viewMode === 'EXPLORE_VIEW') {
      tasks.setViewModeToPresentation.callback()
    }
  }

  render() {
    const tooltipText = this.props.viewMode === 'REPORT_VIEW' ?
      'Explore this notebook' : 'Go to Report view'
    return (
      <Tooltip
        classes={{ tooltip: 'iodide-tooltip' }}
        title={tooltipText}
      >
        <Button
          style={{ color: this.props.textColor || '#fafafa' }}
          onClick={this.toggleViewMode}
          variant="text"
          mini
        >
          {this.props.viewMode === 'REPORT_VIEW' ? 'Explore' : 'Report'}
        </Button>
      </Tooltip>
    )
  }
}
export function mapStateToProps(state) {
  // get the viewMode from state
  return {
    viewMode: state.viewMode,
  }
}

export default connect(mapStateToProps)(ViewModeToggleButtonUnconnected)
