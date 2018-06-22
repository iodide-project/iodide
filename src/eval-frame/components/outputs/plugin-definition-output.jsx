import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import OutputRow from './output-row'
import { OutputContainer } from './output-container'
import OutputRenderer from './output-renderer'

export class PluginDefOutputUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
  }
  render() {
    return (
      <OutputContainer cellId={this.props.cellId}>
        <OutputRow cellId={this.props.cellId} rowType="output">
          <div className="plugin-download-status">
            <OutputRenderer cellId={this.props.cellId} />
          </div>
        </OutputRow>
      </OutputContainer>
    )
  }
}

export default connect()(PluginDefOutputUnconnected)
