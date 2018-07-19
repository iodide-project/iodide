import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import OutputRow from './output-row'
import OutputContainer from './output-container'
import OutputRenderer from './output-renderer'

export class CodeOutputUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
  }

  render() {
    return (
      <OutputContainer cellId={this.props.cellId}>
        {this.props.showSideEffectRow ?
          <OutputRow cellId={this.props.cellId} rowType="sideeffect">
            <div id={`cell-${this.props.cellId}-side-effect-target`} className="side-effect-target" />
          </OutputRow>
          : undefined
        }
        {this.props.showOutputRow ?
          <OutputRow cellId={this.props.cellId} rowType="output">
            <OutputRenderer cellId={this.props.cellId} />
          </OutputRow>
          : undefined
        }
      </OutputContainer>
    )
  }
}

export default connect()(CodeOutputUnconnected)
