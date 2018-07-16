import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from '@material-ui/core/Tooltip'

export default class PaneContentButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  }
  render() {
    return (
      <Tooltip classes={{ tooltip: 'iodide-tooltip' }} title={this.props.text}>
        <button
          className="pane-button light-pane-button"
          onClick={this.props.onClick}
        >
          {this.props.children}
        </button>
      </Tooltip>
    )
  }
}
