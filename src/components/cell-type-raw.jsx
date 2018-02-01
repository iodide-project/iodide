import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CellEditor from './cell-editor.jsx'
import OneRowCell from './one-row-cell.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'


export class RawCell_unconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
  }
  render() {
    return (
      <OneRowCell cellId={this.props.cellId}>
        <CellEditor
          cellId={this.props.cellId}
          editorOptions = {{
            matchBrackets: false,
            autoCloseBrackets: false,
          }}
        />
      </OneRowCell>
    )
  }
}

export default connect()(RawCell_unconnected)