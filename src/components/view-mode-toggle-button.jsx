import React from 'react'
import PropTypes from 'prop-types'

import FlatButton from 'material-ui/FlatButton'

class ViewModeToggleButton extends React.Component {
  static propTypes = {
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    actions: PropTypes.shape({
      setViewMode: PropTypes.func.isRequired,
    }).isRequired,
    textColor: PropTypes.string,
    hoverColor: PropTypes.string,
  }
  constructor(props) {
    super(props)
    this.toggleViewMode = this.toggleViewMode.bind(this)
  }

  toggleViewMode() {
    if (this.props.viewMode === 'presentation') {
      this.props.actions.setViewMode('editor')
    } else if (this.props.viewMode === 'editor') {
      this.props.actions.setViewMode('presentation')
    }
  }

  render() {
    let buttonString
    if (this.props.viewMode === 'presentation') {
      buttonString = 'Edit'
    } else if (this.props.viewMode === 'editor') {
      buttonString = 'View'
    }
    return (
      <FlatButton style={{ color: this.props.textColor || '#fafafa' }} onClick={this.toggleViewMode} hoverColor={this.props.hoverColor || 'darkgray'} label={buttonString} />
    )
  }
}

export default ViewModeToggleButton
