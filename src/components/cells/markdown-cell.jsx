import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import CellRow from './cell-row'
import { CellContainer } from './cell-container'

import CellEditor from './cell-editor'

export class MarkdownCellUnconnected extends React.Component {
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
              lineWrapping: true,
              matchBrackets: false,
              autoCloseBrackets: false,
              lineNumbers: false,
            }}
          />
        </CellRow>
      </CellContainer>
    )
  }
}

export default connect()(MarkdownCellUnconnected)
