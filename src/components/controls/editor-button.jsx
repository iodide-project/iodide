import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from 'material-ui/Tooltip'

export class EditorButton extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func.isRequired,
  }
  render() {
    return (
      <Tooltip classes={{ tooltip: 'iodide-tooltip' }} title={this.props.text}>
        <button
          className={`display-button ${this.props.isActive ? 'is-active' : ''} ${this.props.className || ''}`}
          style={this.props.style}
          onClick={this.props.onClick}
        >{this.props.children}
        </button>
      </Tooltip>)
  }
}
