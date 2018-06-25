/* global IODIDE_BUILD_MODE */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import { getCellById } from '../../tools/notebook-utils'
import { cellTypeEnum } from '../../state-prototypes'
import { postMessageToEditor } from '../../port-to-editor'


export class OutputContainerUnconnected extends React.Component {
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    cellId: PropTypes.number.isRequired,
    children: PropTypes.node,
    editingCell: PropTypes.bool.isRequired,
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    cellType: PropTypes.oneOf(cellTypeEnum.values()),
    postMessageToEditor: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.containerRef = React.createRef()
    // this.viewportTop = document.getElementById('cells').getBoundingClientRect().top
  }

  handleCellClick = () => {
    if (this.props.viewMode === 'editor' && !this.props.selected) {
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
    const cellClass = `cell-container ${
      this.props.cellType
    }${
      this.props.selected ? ' selected-cell' : ''
    }${
      this.props.editingCell ? ' editing-cell' : ''
    }`

    return (
      <div
        id={`cell-${this.props.cellId}`}
        className={cellClass}
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
  return {
    cellId: cell.id,
    selected: cell.selected,
    editingCell: cell.selected && state.mode === 'edit',
    viewMode: state.viewMode,
    cellType: cell.cellType,
    postMessageToEditor,
  }
}

export default connect(mapStateToProps)(OutputContainerUnconnected)
