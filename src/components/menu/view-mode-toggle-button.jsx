import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'
import tasks from '../../actions/task-definitions'

export class ViewModeToggleButtonUnconnected extends React.Component {
  static propTypes = {
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    textColor: PropTypes.string,
    hoverColor: PropTypes.string,
  }
  constructor(props) {
    super(props)
    this.toggleViewMode = this.toggleViewMode.bind(this)
  }

  toggleViewMode() {
    if (this.props.viewMode === 'presentation') {
      tasks.setViewModeToEditor.callback()
    } else if (this.props.viewMode === 'editor') {
      tasks.setViewModeToPresentation.callback()
    }
  }

  render() {
    return (
      <Tooltip classes={{ tooltip: 'iodide-tooltip' }} title={this.props.viewMode === 'presentation' ? 'Edit this page' : 'Presentation'}>
        <Button
          style={{ color: this.props.textColor || '#fafafa' }}
          onClick={this.toggleViewMode}
          variant="flat"
          mini
        >
          {this.props.viewMode === 'presentation' ? 'Explore' : 'Present'}
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
