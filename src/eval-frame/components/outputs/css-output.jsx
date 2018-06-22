import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import OutputRow from './output-row'
import { OutputContainer } from './output-container'

import { getCellById } from '../../tools/notebook-utils'

export class CSSOutputUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.any,
    rendered: PropTypes.bool.isRequired,
  }

  render() {
    return (
      <OutputContainer cellId={this.props.cellId}>
        <OutputRow cellId={this.props.cellId} rowType="input">
          <style>
            {this.props.rendered && this.props.value}
          </style>
        </OutputRow>
      </OutputContainer>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    cellId: cell.id,
    value: cell.value,
    rendered: cell.rendered,
  }
}

export default connect(mapStateToProps)(CSSOutputUnconnected)
