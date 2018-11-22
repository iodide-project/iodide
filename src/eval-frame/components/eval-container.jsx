import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ReportPane from './panes/report-pane'
import DeclaredVariablesPane from './panes/declared-variables-pane'
import ConsolePane from './panes/console-pane'
import AppInfoPane from './panes/app-info-pane'
import ErrorPane from './panes/ErrorPane'

import FixedPositionContainer from '../../components/pane-layout/fixed-position-container'


export class EvalContainerUnconnected extends React.Component {
  static propTypes = {
    reportOnly: PropTypes.bool.isRequired,
  }
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  }
  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error,
      errorInfo: info,
    })
    console.log(error, info)
  }


  render() {
    const { reportOnly } = this.props
    let render = (
      <React.Fragment>

        <FixedPositionContainer paneId="ReportPositioner" fullscreen={reportOnly}>
          <ReportPane />
        </FixedPositionContainer>

        <FixedPositionContainer paneId="ConsolePositioner" hidden={reportOnly}>
          <ConsolePane />
        </FixedPositionContainer>

        <FixedPositionContainer paneId="WorkspacePositioner" hidden={reportOnly}>
          <DeclaredVariablesPane />
        </FixedPositionContainer>

        <FixedPositionContainer paneId="AppInfoPositioner" hidden={reportOnly}>
          <AppInfoPane />
        </FixedPositionContainer>

      </React.Fragment>)
    if (this.state.hasError) {
      render = <ErrorPane error={this.state.error} errorInfo={this.state.errorInfo} />
    }


    return (
      <React.Fragment>

        {render}

      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    reportOnly: state.viewMode === 'REPORT_VIEW',
  }
}

export default connect(mapStateToProps)(EvalContainerUnconnected)
