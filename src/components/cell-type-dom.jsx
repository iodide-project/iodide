import React, { createElement } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TwoRowCell from './two-row-cell'
import CellEditor from './cell-editor'

import actions from '../actions'
import { getCellById } from '../notebook-utils'

function parseDOMCellContent(content) {
  const elems = content.split('#')
  const [elem, elemID] = elems
  return { elem, elemID }
}


class DOMCell extends React.Component {
  outputComponent = () => {
    let elem
    const content = parseDOMCellContent(this.props.content)
    if (content.elem !== '' && content.elem !== undefined) {
      try {
        elem = createElement(content.elem, { id: content.elemID })
      } catch (err) {
        console.error(`elem ${content.elem} is not valid`)
        elem = <div className="dom-cell-error">{content.elem} is not valid</div>
      }
    } else {
      elem = <div className="dom-cell-error">please add an elem type</div>
    }
    return elem
  }

  render() {
    return (
      <TwoRowCell
        cellId={this.props.cellId}
        row1={
          <CellEditor cellId={this.props.cellId} />
      }
        row2={this.outputComponent()}
      />
    )
  }
}


function mapStateToPropsForCells(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
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
