import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from 'material-ui/Button'

import tasks from '../../task-definitions'

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
      <Button
        style={{ color: this.props.textColor || '#fafafa' }}
        onClick={this.toggleViewMode}
        mini
      >
        {this.props.viewMode === 'presentation' ? 'Edit' : 'View'}
      </Button>
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
