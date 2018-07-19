import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'

import RawOutput from './outputs/raw-output'
import ExternalDependencyOutput from './outputs/external-resource-output'
import CSSOutput from './outputs/css-output'
import CodeOutput from './outputs/code-output'
import MarkdownOutput from './outputs/markdown-output'
import PluginDefinitionOutput from './outputs/plugin-definition-output'

import DeclaredVariablesPane from './panes/declared-variables-pane'
import HistoryPane from './panes/history-pane'
import ConsolePane from './panes/console-pane'

class EvalContainer extends React.Component {
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
    const bodyContent = this.props.cellIds.map((id, i) => {
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
    })
    return (
      <React.Fragment>
        <div id="cells">
          {bodyContent}
        </div>
        <div
          className="eval-frame-panes-container"
        >
          <DeclaredVariablesPane />
          <HistoryPane />
          <ConsolePane />
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    cellIds: state.cells.map(c => c.id),
    cellTypes: state.cells.map(c => c.cellType),
  }
}

export default connect(mapStateToProps)(EvalContainer)
