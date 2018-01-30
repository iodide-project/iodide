import {GenericCell} from './cell.jsx'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'


class CSSCell extends GenericCell {
  constructor(props) {
    super(props)
  }

  outputComponent() {
    return <style>
      {this.props.cell.content}
    </style>
  }
}

function mapStateToPropsForCells(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    display: true,
    pageMode: state.mode,
    viewMode: state.viewMode,
    ref: 'cell' + cell.id,
    cell: Object.assign({}, cell),
    id: cell.id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}
const CSSCellConnected = connect(mapStateToPropsForCells, mapDispatchToProps)(CSSCell)
export {CSSCellConnected as CSSCell}

