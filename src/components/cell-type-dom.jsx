import React, {createElement} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import TwoRowCell from './two-row-cell.jsx'
import CellOutput from './output.jsx'
import CellEditor from './cell-editor.jsx'

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


class DOMCell extends React.Component {
  outputComponent = () => {
    let elem
    let content = parseDOMCellContent(this.props.content)
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

  render() {
  return (
    <TwoRowCell
      cellId={this.props.cellId}
      row1 = {
        <CellEditor cellId={this.props.cellId} />
      }
      row2 = { this.outputComponent() }
    />
    )
  }
}



function mapStateToPropsForCells(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    content: cell.content,
    rendered: cell.rendered,
    cellId: cell.id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToPropsForCells, mapDispatchToProps)(DOMCell)