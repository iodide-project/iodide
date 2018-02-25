import MenuItem from 'material-ui/MenuItem'
import React from 'react'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'

export default class NotebookMenuSubsection extends React.Component {
  render() {
    const children = React.Children.map(this.props.children, c => React.cloneElement(c, { className: 'medium-menu' }))
    return (
      <MenuItem
        style={{ fontSize: '13px', width: '400px !important' }}
        primaryText={this.props.title}
        rightIcon={<ArrowDropRight />}
        menuItems={children}
      />
    )
  }
}
