import React from 'react'
import PropTypes from 'prop-types'
import Subheader from 'material-ui/List/ListSubheader'

export default class NotebookMenuHeader extends React.Component {
  static propTypes = { title: PropTypes.string, onClick: PropTypes.func }
  render() {
    return (
      <Subheader disableSticky={Boolean(true)} key={this.props.title}>
        {this.props.title}
      </Subheader>
    )
  }
}
