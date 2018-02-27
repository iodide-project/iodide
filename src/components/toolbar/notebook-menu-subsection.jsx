import React from 'react'
import PropTypes from 'prop-types'

import MenuItem from 'material-ui/MenuItem'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'

export default class NotebookMenuSubsection extends React.Component {
  static propTypes = {
    title: PropTypes.string,
  }
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
