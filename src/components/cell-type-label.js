import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

// import CellRow from './cell-row'
// import { CellContainer } from './cell-container'

// import CellEditor from './cell-editor'

import * as actions from '../actions'
import { getCellById } from '../notebook-utils'


export class CellTypeLabel extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.string,
    showMarkdown: PropTypes.bool.isRequired,
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
  }

  enterEditMode = () => {
    if (this.props.viewMode === 'editor') {
      this.props.actions.changeMode('edit')
      this.props.actions.markCellNotRendered()
    }
  }

  render() {
    return (
      <div className="cell-type-label">{this.props.label}</div>
    )
  }
}


function mapStateToProps(state, ownProps) {
  const { cellId } = ownProps
  const cell = getCellById(state.cells, cellId)
  let label
  if (cell.cellType === 'code') {
    label = cell.language
  } else if (cell.cellType === 'markdown') {
    label = 'md'
  } else if (cell.cellType === 'css') {
    label = 'css'
  } else if (cell.cellType === 'plugin') {
    label = 'plugin'
  }
  return {
    label,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CellTypeLabel)
