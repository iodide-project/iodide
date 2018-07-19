import React from 'react'
// import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
// import deepEqual from 'deep-equal'

// import RawOutput from './outputs/raw-output'
// import ExternalDependencyOutput from './outputs/external-resource-output'
// import CSSOutput from './outputs/css-output'
// import CodeOutput from './outputs/code-output'
// import MarkdownOutput from './outputs/markdown-output'
// import PluginDefinitionOutput from './outputs/plugin-definition-output'
import CellsList from './cells-list'

import DeclaredVariablesPane from './panes/declared-variables-pane'
import HistoryPane from './panes/history-pane'
import ConsolePane from './panes/console-pane'

import EditorLinkButton from './controls/editor-link-button'

export default class EvalContainer extends React.Component {
  // static propTypes = {
  //   // viewMode: PropTypes.oneOf(['EXPLORE_VIEW', 'REPORT_VIEW']),
  //   // title: PropTypes.string,
  //   cellIds: PropTypes.array,
  //   cellTypes: PropTypes.array,
  // }

  // shouldComponentUpdate(nextProps) {
  //   return !deepEqual(this.props, nextProps)
  // }

  render() {
    return (
      <React.Fragment>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 50,
        }}
        >
          <EditorLinkButton />
        </div>
        <div id="cells">
          <CellsList containingPane="REPORT_PANE" />
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

// function mapStateToProps(state) {
//   return {
//     cellIds: state.cells.map(c => c.id),
//     cellTypes: state.cells.map(c => c.cellType),
//   }
// }

// export default connect(mapStateToProps)(EvalContainer)
