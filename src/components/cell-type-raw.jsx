import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {GenericCell} from './cell.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'





class RawCell extends GenericCell {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    // FIXME: this is of a hack to make sure that the output for raw cells
    // is set to COLLAPSED in presentation View
    this.props.actions.setCellCollapsedState(
      'presentation',
      'output',
      'COLLAPSED')
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

const connectedCell = connect(mapStateToPropsForCells, mapDispatchToProps)(RawCell)
export {connectedCell as RawCell}

