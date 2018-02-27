import MenuItem from 'material-ui/MenuItem'
import React from 'react'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'

export default class NotebookMenuSubsection extends React.Component {
  render() {
    const children = React.Children.map(this.props.children, c => React.cloneElement(c, { className: ' medium-menu', width: 256 }))
    return (
      <MenuItem
        innerDivStyle={{ width: '200px !important' }}
        style={{ fontSize: '13px' }}
        primaryText={this.props.title}
        rightIcon={<ArrowDropRight />}
        menuItems={children}
      />
    )
  }
}
