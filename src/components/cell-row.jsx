import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types';

import { getCellById } from '../notebook-utils'
import actions from '../actions'

class CellRow extends React.Component {
  static propTypes = {
    executionString: PropTypes.string,
    pageMode: PropTypes.oneOf(['command', 'edit']),
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    collapsedState: PropTypes.string,
    rowType: PropTypes.string,
    actions: PropTypes.shape({
      setCellCollapsedState: PropTypes.func.isRequired,
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
    // uncollapse the editor upon entering edit mode.
    // note: entering editMode is only allowed from editorView
    // thus, we only need to check the editorView collapsed state
    if (this.props.viewMode === 'editor' &&
      this.props.pageMode === 'edit' &&
      this.props.rowType === 'input' &&
      this.props.collapsedState === 'COLLAPSED') {
      this.props.actions.setCellCollapsedState(
        this.props.viewMode,
        'input',
        'SCROLLABLE',
      )
    }
  }

  handleCollapseButtonClick() {
    let nextCollapsedState
    switch (this.props.collapsedState) {
      case 'COLLAPSED':
        nextCollapsedState = 'EXPANDED'
        break
      case 'EXPANDED':
        nextCollapsedState = 'SCROLLABLE'
        break
      case 'SCROLLABLE':
        nextCollapsedState = 'EXPANDED'
        break
      default:
        throw Error(`Unknown collapsedState ${this.props.collapsedState}`)
    }
    this.props.actions.setCellCollapsedState(
      this.props.viewMode,
      this.props.rowType,
      nextCollapsedState,
    )
  }

  render() {
    return (
      <div className={`cell-row ${this.props.rowType} ${this.props.collapsedState}`}>
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
  let collapsedState
  switch (`${state.viewMode},${ownProps.rowType}`) {
    case 'presentation,input':
      collapsedState = cell.collapsePresentationViewInput
      break
    case 'presentation,output':
      collapsedState = cell.collapsePresentationViewOutput
      break
    case 'editor,input':
      collapsedState = cell.collapseEditViewInput
      break
    case 'editor,output':
      collapsedState = cell.collapseEditViewOutput
      break
    default:
      throw Error(`Unsupported viewMode,rowType ${state.viewMode},${ownProps.rowType}`)
  }
  const executionString = (ownProps.rowType === 'input'
    && cell.cellType === 'javascript') ? `[${cell.executionStatus}]` : ''

  // let collapseButtonLabel
  // if (collapsedState === 'COLLAPSED') {
  //   collapseButtonLabel = (ownProps.rowType === 'input') ? cell.cellType : 'output'
  // } else {
  //   collapseButtonLabel = ''
  // }
  return {
    pageMode: state.mode,
    viewMode: state.viewMode,
    cellType: cell.cellType,
    executionString,
    collapsedState,
    // collapseButtonLabel,
  }
}

function mapDispatchToPropsCellRows(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToPropsCellRows, mapDispatchToPropsCellRows)(CellRow)
