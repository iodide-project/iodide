import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'

import FilterButton from './controls/filter-button'
import SortButton from './controls/sort-button'

import RawOutput from './outputs/raw-output'
import ExternalDependencyOutput from './outputs/external-resource-output'
import CSSOutput from './outputs/css-output'
import CodeOutput from './outputs/code-output'
import MarkdownOutput from './outputs/markdown-output'
import PluginDefinitionOutput from './outputs/plugin-definition-output'

import tasks from '../actions/eval-frame-tasks'
import UserTask from '../../actions/user-task'

class CellsList extends React.Component {
  static propTypes = {
    // viewMode: PropTypes.oneOf(['EXPLORE_VIEW', 'REPORT_VIEW']),
    // title: PropTypes.string,
    cellIds: PropTypes.array,
    cellTypes: PropTypes.array,
    sortTask: PropTypes.instanceOf(UserTask),
  }

  constructor(props) {
    super(props);
    this.cellListRef = React.createRef()
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps)
  }

  componentDidUpdate() {
    console.log('this.cellListRef', this.cellListRef)
    console.log('this.cellListRef.current', this.cellListRef.current)
    if (this.props.sortOrder === 'EVAL_ORDER') {
      console.log(this.cellListRef.current.scrollHeight)
      this.cellListRef.current.scrollTo(0, this.cellListRef.current.scrollHeight)
    }
  }

  render() {
    return (
      <div
        id={this.props.id}
        className="cells-list"
        style={this.props.style}
        ref={this.cellListRef}
      >
        <div style={{ position: 'absolute', left: 0, marginTop: '-20px' }}>
          <FilterButton task={this.props.filterTask} />
          <SortButton task={this.props.sortTask} />
        </div>
        { this.props.cellIds.map((id, i) => {
          switch (this.props.cellTypes[i]) {
            case 'code':
              return (<CodeOutput
                cellId={id}
                key={id}
                showSideEffectRow={this.props.showSideEffectRow}
                showOutputRow={this.props.showOutputRow}
              />)
            case 'markdown':
              return <MarkdownOutput cellId={id} key={id} />
            case 'raw':
              return <RawOutput cellId={id} key={id} />
            case 'external dependencies':
              return <ExternalDependencyOutput cellId={id} key={id} />
            case 'css':
              return <CSSOutput cellId={id} key={id} />
            case 'plugin':
              return <PluginDefinitionOutput cellId={id} key={id} />
            default:
              // TODO: Use better class for inline error
              return <div>Unknown cell type {this.props.cellTypes[i]}</div>
          }
        })}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  let sortOrder
  let outputFilter
  let sortTask
  let filterTask
  // let cellsList
  if (ownProps.containingPane === 'REPORT_PANE') {
    sortOrder = state.reportPaneSort
    outputFilter = state.reportPaneOutputFilter
    sortTask = tasks.changeReportPaneSort
    filterTask = tasks.changeReportPaneFilter
  } else if (ownProps.containingPane === 'CONSOLE_PANE') {
    sortOrder = state.consolePaneSort
    outputFilter = state.consolePaneOutputFilter
    sortTask = tasks.changeConsolePaneSort
    filterTask = tasks.changeConsolePaneFilter
  }

  const cellsList = state.cells.slice().filter((cell) => {
    switch (outputFilter) {
      case 'SHOW_ALL_ROWS':
        return true
      case 'OUTPUT_ROWS_ONLY':
        return ['code', 'external dependencies', 'plugin'].includes(cell.cellType)
      case 'REPORT_ROWS_ONLY':
        return ['code', 'markdown'].includes(cell.cellType)
      default:
        return true
    }
  })

  if (sortOrder === 'CELL_ORDER') {
    // no op
  } else if (sortOrder === 'EVAL_ORDER') {
    cellsList.sort((c1, c2) => c1.lastEvalTime > c2.lastEvalTime)
  }

  return {
    sortTask,
    filterTask,
    sortOrder,
    cellIds: cellsList.map(c => c.id),
    cellTypes: cellsList.map(c => c.cellType),
    showSideEffectRow: ['SHOW_ALL_ROWS', 'REPORT_ROWS_ONLY'].includes(outputFilter),
    showOutputRow: ['SHOW_ALL_ROWS', 'OUTPUT_ROWS_ONLY'].includes(outputFilter),
  }
}

export default connect(mapStateToProps)(CellsList)
