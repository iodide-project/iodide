import React from 'react'
import IconButton from 'material-ui/IconButton'

export default class NotebookTaskFunction extends React.Component {
  render() {
    return (
      <IconButton
        tooltip={this.props.task.title}
        style={this.props.iconStyle || { color: '#fafafa' }}
        onClick={this.props.task.callback}
      >
        {this.props.children}
      </IconButton>
    )
  }
}
