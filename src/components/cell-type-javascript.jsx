import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {GenericCell} from './cell.jsx'
import CellEditor from './cell-editor.jsx'
import CellOutput from './output.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'



class JavascriptCell extends GenericCell {
  constructor(props) {
    super(props)
    this.editorOptions.lineNumbers = true
    this.editorOptions.matchBrackets = true
    this.editorOptions.autoCloseBrackets = true
    this.editorOptions.keyMap = 'sublime'
    this.outputComponent = this.outputComponent.bind(this)
  }

  outputComponent() {
      return <CellOutput
        valueToRender={this.props.value}
        renderValue={this.props.rendered} />
  }
}




function mapStateToPropsForCells(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    display: true,
    pageMode: state.mode,
    viewMode: state.viewMode,
    ref: 'cell' + cell.id,
    // TODO: remove need to pass all of cell; this is needed for the
    // parent GenericCell class
    cell: Object.assign({}, cell),
    value: cell.value,
    rendered: cell.rendered,
    id: cell.id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

const connectedCell = connect(mapStateToPropsForCells, mapDispatchToProps)(JavascriptCell)
export {connectedCell as JavascriptCell}

