import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CellRow from './cell-row'
import { CellContainer } from './cell-container'
import CellOutput from './cell-output'

export class PluginDefCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
  }
  render() {
    return (
      <CellContainer cellId={this.props.cellId}>
        <CellRow cellId={this.props.cellId} rowType="output">
          <div className="plugin-download-status">
            <CellOutput cellId={this.props.cellId} />
          </div>
        </CellRow>
      </CellContainer>
    )
  }
}

export default connect()(PluginDefCellUnconnected)
