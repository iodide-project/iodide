import React from 'react'

import PresentationModeToolbar from './toolbar/presentation-mode-toolbar'
import EditorModeToolbar from './toolbar/editor-mode-toolbar'

import DeclaredVariablesPane from './toolbar/declared-variables-pane'
import HistoryPane from './toolbar/history-pane'

export default class NotebookHeader extends React.Component {
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
