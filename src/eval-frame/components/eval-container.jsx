import React from 'react'

import CellsList from './cells-list'
// import PaneContainer from './panes/pane-container'
import EditorLinkButton from './controls/editor-link-button'

import DeclaredVariablesPane from './panes/declared-variables-pane'
import HistoryPane from './panes/history-pane'
import AppInfo from './panes/app-info-pane'

import FixedPositionContainer from '../../components/fixed-position-container'


export default class EvalContainer extends React.Component {
  render() {
    return (
      <React.Fragment>

        <FixedPositionContainer paneId="ReportPositioner">
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
        </FixedPositionContainer>

        <FixedPositionContainer paneId="ConsolePositioner">
          <HistoryPane />
        </FixedPositionContainer>

        <FixedPositionContainer paneId="WorkspacePositioner">
          <DeclaredVariablesPane />
        </FixedPositionContainer>

        <FixedPositionContainer paneId="AppInfoPositioner">
          <AppInfo />
        </FixedPositionContainer>

      </React.Fragment>
    )
  }
}
