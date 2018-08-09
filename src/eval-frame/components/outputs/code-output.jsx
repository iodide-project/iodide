import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import OutputContainer from './output-container'

export class CodeOutputUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
  }

  render() {
    return (
      <OutputContainer cellId={this.props.cellId}>
        <div id={`cell-${this.props.cellId}-side-effect-target`} className="side-effect-target" />
      </OutputContainer>
    )
  }
}

export default connect()(CodeOutputUnconnected)
