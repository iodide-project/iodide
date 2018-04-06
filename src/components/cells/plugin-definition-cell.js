import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CellRow from './cell-row'
import { CellContainer } from './cell-container'
import CellEditor from './cell-editor'
import CellOutput from './cell-output'

// import PluginProgressMonitor from './plugin-progress-monitor'


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
          <div className="plugin-download-status">
            <CellOutput cellId={this.props.cellId} />
          </div>
        </CellRow>
      </CellContainer>
    )
  }
}

export default connect()(PluginDefCellUnconnected)
