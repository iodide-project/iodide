import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import TwoRowCell from './two-row-cell.jsx'
import CellOutput from './output.jsx'
import CellEditor from './cell-editor.jsx'

import {getCellById} from '../notebook-utils.js'



export class JsCell_unconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.any,
    rendered: PropTypes.bool.isRequired,
  }

  render() {
    let row1 = <CellEditor cellId={this.props.cellId} />
    let row2 = <CellOutput
            valueToRender={this.props.value}
            render={this.props.rendered} />
    return (
      <TwoRowCell
        cellId={this.props.cellId}
        row1 = {row1}
        row2 = {row2}
      />
    )
  }
}


export function mapStateToProps(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    value: cell.value,
    rendered: cell.rendered,
  }
}


export default connect(mapStateToProps)(JsCell_unconnected)