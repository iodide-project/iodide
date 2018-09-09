import React from 'react'

// import CellsList from './cells-list'
// import PaneContainer from './panes/pane-container'
// import EditorLinkButton from './controls/editor-link-button'

import ReportPane from './panes/report-pane'
import DeclaredVariablesPane from './panes/declared-variables-pane'
import ConsolePane from './panes/console-pane'
import AppInfoPane from './panes/app-info-pane'

import FixedPositionContainer from '../../components/fixed-position-container'


export default class EvalContainer extends React.Component {
  render() {
    return (
      <React.Fragment>

        <FixedPositionContainer paneId="ReportPositioner">
          <ReportPane />
        </FixedPositionContainer>

        <FixedPositionContainer paneId="ConsolePositioner">
          <ConsolePane />
        </FixedPositionContainer>

        <FixedPositionContainer paneId="WorkspacePositioner">
          <DeclaredVariablesPane />
        </FixedPositionContainer>

        <FixedPositionContainer paneId="AppInfoPositioner">
          <AppInfoPane />
        </FixedPositionContainer>

      </React.Fragment>
    )
  }
}
