import React from 'react'

import CellsList from '../cells-list'
// import PaneContainer from './panes/pane-container'
import EditorLinkButton from '../controls/editor-link-button'

export default class ReportPaneUnconnected extends React.Component {
  render() {
    return (
      <div className="pane-content" >
        <div
          className="display-none-in-report"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        >
          <EditorLinkButton />
        </div>
        <CellsList id="cells" />
      </div>
    )
  }
}
