import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {GenericCell} from './cell.jsx'
import CellEditor from './cell-editor.jsx'
import CellOutput from './output.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'








function parseDOMCellContent(content) {
  let elems = content.split('#')
  let elem = elems[0]
  let elemID
  if (elems.length > 1) {
    elemID = elems[1]
  } else {
    elemID = undefined
  }
  return {elem, elemID}
}

class DOMCell extends GenericCell {
  constructor(props) {
    super(props)
  }

  outputComponent() {
    let elem
    let content = parseDOMCellContent(this.props.cell.content)
    if (content.elem !== '' && content.elem !== undefined) {
      try {
        elem = createElement(content.elem, {id: content.elemID})
      } catch (err) {
        console.error(`elem ${content.elem} is not valid`)
        elem = <div className='dom-cell-error'>{content.elem} is not valid</div>
      }
      
    } else {
      elem = <div className='dom-cell-error'>please add an elem type</div>
    }
    return elem
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

const connectedCell = connect(mapStateToPropsForCells, mapDispatchToProps)(DOMCell)
export {connectedCell as DOMCell}

