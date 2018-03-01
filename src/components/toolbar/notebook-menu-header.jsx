import React from 'react'
import PropTypes from 'prop-types'
import Subheader from 'material-ui/List/ListSubheader'

export default class NotebookMenuHeader extends React.Component {
  static propTypes = { title: PropTypes.string }
  render() { return <Subheader key={this.props.title}> {this.props.title} </Subheader> }
}
