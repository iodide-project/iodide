import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CellRow from './cell-row'
import { CellContainer } from './cell-container'
import CellEditor from './cell-editor'
import PluginProgressMonitor from './plugin-progress-monitor'


export class PluginDefCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
  }
  render() {
    return (
      <CellContainer cellId={this.props.cellId}>
        <CellRow cellId={this.props.cellId} rowType="input">
          <CellEditor
            cellId={this.props.cellId}
            editorOptions={{
              matchBrackets: false,
              autoCloseBrackets: false,
            }}
          />
        </CellRow>
        <CellRow cellId={this.props.cellId} rowType="output">
          <PluginProgressMonitor cellId={this.props.cellId} />
        </CellRow>
      </CellContainer>
    )
  }
}

export default connect()(PluginDefCellUnconnected)
