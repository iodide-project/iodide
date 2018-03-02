import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types';

import { getCellById } from '../notebook-utils'
import actions from '../actions'
import { rowOverflowEnum, nextOverflow } from '../state-prototypes'

class CellRow extends React.Component {
  static propTypes = {
    executionString: PropTypes.string,
    pageMode: PropTypes.oneOf(['command', 'edit', 'title-edit']),
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    rowOverflow: PropTypes.oneOf(rowOverflowEnum.values()),
    rowType: PropTypes.string,
    actions: PropTypes.shape({
      setCellRowCollapsedState: PropTypes.func.isRequired,
    }).isRequired,
    // collapseButtonLabel: PropTypes.string.isRequired,
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
    if (this.props.viewMode === 'editor' &&
      this.props.pageMode === 'edit' &&
      this.props.rowType === 'input' &&
      this.props.rowOverflow === rowOverflowEnum.HIDDEN) {
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
    return (
      <div className={`cell-row ${this.props.rowType} ${this.props.rowOverflow}`}>
        <div className="status">
          {this.props.executionString}
        </div>
        <div
          className="collapse-button"
          onClick={this.handleCollapseButtonClick}
        >
          {/* this.props.collapseButtonLabel */}
        </div>
        <div className="main-component">
          {this.props.children}
        </div>
      </div>
    )
  }
}

function mapStateToPropsCellRows(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  // const row = cell.rows.filter(r => r.rowType === ownProps.rowType)[0]

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
    && cell.cellType === 'javascript') ? `[${cell.executionStatus}]` : ''
  return {
    pageMode: state.mode,
    viewMode: state.viewMode,
    executionString,
    rowOverflow,
  }
}

function mapDispatchToPropsCellRows(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToPropsCellRows, mapDispatchToPropsCellRows)(CellRow)
