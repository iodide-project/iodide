import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CellEditor from './cell-editor'
import OneRowCell from './one-row-cell'


export class RawCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
  }
  render() {
    return (
      <OneRowCell cellId={this.props.cellId}>
        <CellEditor
          cellId={this.props.cellId}
          editorOptions={{
            matchBrackets: false,
            autoCloseBrackets: false,
          }}
        />
      </OneRowCell>
    )
  }
}

export default connect()(RawCellUnconnected)
