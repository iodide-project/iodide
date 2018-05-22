import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import Tooltip from 'material-ui/Tooltip'

import { getCellById } from '../../tools/notebook-utils'
import * as actions from '../../actions/actions'
import { rowOverflowEnum, nextOverflow } from '../../state-prototypes'

export class CellRowUnconnected extends React.Component {
  static propTypes = {
    executionString: PropTypes.string,
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    rowOverflow: PropTypes.oneOf(rowOverflowEnum.values()),
    rowType: PropTypes.string,
    collapseTooltipPlacement: PropTypes.string.isRequired,
    actions: PropTypes.shape({
      setCellRowCollapsedState: PropTypes.func.isRequired,
    }).isRequired,
    children: PropTypes.node,
  }

  constructor(props) {
    super(props)
    // explicitly bind "this" for all methods in constructors
    this.handleCollapseButtonClick = this.handleCollapseButtonClick.bind(this)
  }

  componentDidUpdate() {
    // if this is an input row, uncollapse
    // the editor upon entering edit mode.
    // note: entering editMode is only allowed from editor View
    // thus, we only need to check the editorView collapsed state
    if (this.props.uncollapseOnUpdate) {
      this.props.actions.setCellRowCollapsedState(
        'editor',
        'input',
        rowOverflowEnum.SCROLL,
      )
    }
  }

  handleCollapseButtonClick() {
    // the collapse button should only work in EXPLORE view
    if (this.props.viewMode === 'editor') {
      this.props.actions.setCellRowCollapsedState(
        'editor',
        this.props.rowType,
        nextOverflow(this.props.rowOverflow),
      )
    }
  }

  render() {
    // console.log(`render cell-row: cellId:${this.props.cellId} ${this.props.rowType}`)
    return (
      <div className={`cell-row ${this.props.rowType} ${this.props.rowOverflow}`}>
        <Tooltip
          classes={{ root: 'collapse-button-tooltip-wrapper', tooltip: 'iodide-tooltip' }}
          placement={this.props.collapseTooltipPlacement}
          title={this.props.tooltipText}
          enterDelay={600}
        >
          <div
            className="collapse-button"
            onClick={this.handleCollapseButtonClick}
          />
        </Tooltip>
        <div className="main-component">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export function mapStateToPropsCellRows(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  let view
  // this block can be deprecated if we move to enums for VIEWs
  switch (state.viewMode) {
    case 'editor':
      view = 'EXPLORE'
      break
    case 'presentation':
      view = 'REPORT'
      break
    default:
      throw Error(`Unsupported viewMode: ${state.viewMode}`)
  }
  const rowOverflow = cell.rowSettings[view][ownProps.rowType]
  const executionString = (ownProps.rowType === 'input'
    && cell.cellType === 'code') ? `[${cell.executionStatus}]` : ''
  // if this is an input row, uncollapse
  // the editor upon entering edit mode.
  // note: entering editMode is only allowed from editor View
  // thus, we only need to check the editorView collapsed state
  const uncollapseOnUpdate = (
    cell.selected &&
    state.viewMode === 'editor' &&
    state.mode === 'edit' &&
    ownProps.rowType === 'input' &&
    rowOverflow === rowOverflowEnum.HIDDEN
  )
  const collapseTooltipPlacement = (
    rowOverflow === rowOverflowEnum.HIDDEN ? 'bottom' : 'right'
  )

  const nextOverflowString = { HIDDEN: 'expand', VISIBLE: 'scroll', SCROLL: 'collapse' }[rowOverflow]
  const tooltipText = `click to ${nextOverflowString} this ${ownProps.rowType}`
  return {
    cellId: ownProps.cellId,
    viewMode: state.viewMode,
    uncollapseOnUpdate,
    executionString,
    rowOverflow,
    collapseTooltipPlacement,
    tooltipText,
  }
}

function mapDispatchToPropsCellRows(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToPropsCellRows, mapDispatchToPropsCellRows)(CellRowUnconnected)
