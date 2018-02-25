// need currentlySelectedCellType() == 'javascript' or whatever
// checked={true}
import MenuItem from 'material-ui/MenuItem'
import React from 'react'

export default class NotebookMenuItem extends React.Component {
  render() {
    return (<MenuItem
      key={this.props.task.title}
      style={{ fontSize: '13px', width: '300px !important' }}
      primaryText={this.props.task.menuTitle}
      secondaryText={this.props.task.displayKeybinding}
      onClick={this.props.task.callback}
    />)
  }
}
