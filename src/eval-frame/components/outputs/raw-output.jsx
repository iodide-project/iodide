import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import OutputRow from './output-row'
import OutputContainer from './output-container'

export class RawOutputUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
  }
  render() {
    return (
      <OutputContainer cellId={this.props.cellId}>
        <OutputRow cellId={this.props.cellId} rowType="output">
          raw cell
        </OutputRow>
      </OutputContainer>
    )
  }
}

export default connect()(RawOutputUnconnected)
