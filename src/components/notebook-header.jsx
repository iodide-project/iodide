import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import PresentationModeToolbar from './presentation-mode-toolbar'
import EditorModeToolbar from './toolbar/editor-mode-toolbar'

import DeclaredVariablesPane from './toolbar/declared-variables-pane'
import HistoryPane from './toolbar/history-pane'

export class NotebookHeader extends React.Component {
  static propTypes = {
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
  }

  render() {
    return (
      <div className="notebook-header">
        <a id="export-anchor" style={{ display: 'none' }} />
        <EditorModeToolbar />
        <PresentationModeToolbar />
        <DeclaredVariablesPane />
        <HistoryPane />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    viewMode: state.viewMode,
  }
}
export default connect(mapStateToProps)(NotebookHeader)
