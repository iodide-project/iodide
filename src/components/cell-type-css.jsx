import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CellEditor from './cell-editor.jsx'
import OneRowCell from './one-row-cell.jsx'

import {getCellById} from '../notebook-utils.js'

export class CSSCell_unconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.any.isRequired,
    rendered: PropTypes.bool.isRequired,
  }

  render() {
    return (
      <OneRowCell cellId={this.props.cellId}>
        <CellEditor cellId={this.props.cellId}/>
        <style>
          {this.props.rendered && this.props.value}
        </style>
      </OneRowCell>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    value: cell.value,
    rendered: cell.rendered
  }
}

export default connect(mapStateToProps)(CSSCell_unconnected)