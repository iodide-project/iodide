import React from 'react'
import Subheader from 'material-ui/Subheader'

export default class NotebookMenuHeader extends React.Component {
  render() { return <Subheader> {this.props.title} </Subheader> }
}
