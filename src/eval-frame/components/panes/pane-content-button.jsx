import React from 'react'
import Tooltip from 'material-ui/Tooltip'

export default class PaneContentButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hovered: false }
    this.hover = this.hover.bind(this)
  }

  hover(tf) { this.setState({ hovered: tf }) }

  render() {
    return (
      <Tooltip classes={{ tooltip: 'iodide-tooltip' }} title={this.props.text}>
        <button
          className={`${this.state.hovered ? 'pane-button-hover' : ''} pane-button light-pane-button`}
          onClick={() => this.props.onClick()}
          onMouseEnter={() => this.hover(true)}
          onMouseLeave={() => this.hover(false)}
        >
          {this.props.children}
        </button>
      </Tooltip>
    )
  }
}
