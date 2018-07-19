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

class CellsList extends React.Component {
  static propTypes = {
    // viewMode: PropTypes.oneOf(['EXPLORE_VIEW', 'REPORT_VIEW']),
    // title: PropTypes.string,
    cellIds: PropTypes.array,
    cellTypes: PropTypes.array,
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps)
  }

  render() {
    return (
      <React.Fragment>
        <div style={{ position: 'absolute', left: 0, marginTop: '-20px' }}>
          <FilterButton />
          <SortButton />
        </div>
        { this.props.cellIds.map((id, i) => {
          switch (this.props.cellTypes[i]) {
            case 'code':
              return <CodeOutput cellId={id} key={id} />
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
      </React.Fragment>
    )
  }
}

function mapStateToProps(state, ownProps) {
  // let cellIds
  // let cellTypes
  let sortOrder
  // let cellsList
  if (ownProps.containingPane === 'REPORT_PANE') {
    sortOrder = state.reportPaneSort
  } else if (ownProps.containingPane === 'CONSOLE_PANE') {
    sortOrder = state.consolePaneSort
  }

  const cellsList = state.cells.slice()
  if (sortOrder === 'CELL_ORDER') {
    // no op
  } else if (sortOrder === 'EVAL_ORDER') {
    cellsList.sort((c1, c2) => c1.lastEvalTime < c2.lastEvalTime)
  }

  // cellIds = cellsList.map(c => c.id)
  // cellTypes = cellsList.map(c => c.cellType)

  return {
    cellIds: cellsList.map(c => c.id),
    cellTypes: cellsList.map(c => c.cellType),
  }
}

export default connect(mapStateToProps)(CellsList)
