import React from 'react'
import IconButton from 'material-ui/IconButton'

export default class NotebookTaskFunction extends React.Component {
  render() {
    return (
      <IconButton
        className="menu-button"
        tooltip={this.props.task.title}
        style={this.props.style || { color: '#fafafa' }}
        onClick={this.props.task.callback}
      >
        {this.props.children}
      </IconButton>
    )
  }
}
