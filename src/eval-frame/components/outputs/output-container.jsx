/* global IODIDE_BUILD_MODE */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import { getCellById } from '../../tools/notebook-utils'
import { postMessageToEditor } from '../../port-to-editor'


export class OutputContainerUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    postMessageToEditor: PropTypes.func.isRequired,
    cellContainerClass: PropTypes.string.isRequired,
    children: PropTypes.node,
  }

  constructor(props) {
    super(props)
    this.containerRef = React.createRef()
  }

  handleCellClick = () => {
    if (!this.props.selected) {
      let targetPxFromViewportTop
      if (IODIDE_BUILD_MODE !== 'test') {
        targetPxFromViewportTop = (
          this.containerRef.current.getBoundingClientRect().top
          - document.getElementById('cells').getBoundingClientRect().top)
      } else {
        targetPxFromViewportTop = 100
      }
      this.props.postMessageToEditor(
        'CLICK_ON_OUTPUT',
        {
          id: this.props.cellId,
          pxFromViewportTop: targetPxFromViewportTop,
        },
      )
    }
  }

  render() {
    return (
      <div
        id={`cell-${this.props.cellId}`}
        className={this.props.cellContainerClass}
        onMouseDown={this.handleCellClick}
        ref={this.containerRef}
      >
        <div className="cell-row-container">
          {this.props.children}
        </div>
      </div>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)

  // note that spaces should be included in the returned strings
  const cellContainerClass = `cell-container ${cell.cellType
  }${cell.selected ? ' selected-cell' : ''
  }${cell.rendered ? ' evaluated' : ' not-evaluated'}`

  return {
    cellId: cell.id,
    selected: cell.selected,
    postMessageToEditor,
    cellContainerClass,
  }
}

export default connect(mapStateToProps)(OutputContainerUnconnected)
