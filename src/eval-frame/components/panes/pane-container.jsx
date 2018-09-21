import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import Resizable from 're-resizable'

import NotebookTaskButton from '../../../components/menu/notebook-task-button'

import { changePaneHeight } from '../../actions/actions'

import tasks from '../../actions/eval-frame-tasks'


import DeclaredVariablesPane from './declared-variables-pane'
import HistoryPane from './history-pane'
import AppInfo from './app-info-pane'

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
})

export class PaneContainerUnconnected extends React.Component {
  static propTypes = {
    paneHeight: PropTypes.number.isRequired,
    viewPaneDisplayStyle: PropTypes.string.isRequired,
    changePaneHeight: PropTypes.func.isRequired,
    paneTitle: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    this.onResizeStopHandler = this.onResizeStopHandler.bind(this)
  }

  onResizeStopHandler(e, direction, ref, d) {
    this.props.changePaneHeight(d.height)
  }

  render() {
    return (
      <div className="eval-frame-panes-container display-none-in-report">
        <Resizable
          enable={{ top: true }}
          size={{ height: this.props.paneHeight, width: '100%' }}
          handleClasses={{ top: 'resizer' }}
          onResizeStop={this.onResizeStopHandler}
        >
          <div
            className="view-pane"
            style={{
              display: this.props.viewPaneDisplayStyle,
              flexDirection: 'column',
            }}
          >
            <MuiThemeProvider theme={theme}>
              <div className="pane-header">
                <div className="pane-title">
                  <NotebookTaskButton
                    tooltip="Close"
                    task={tasks.closePanes}
                    style={{ color: '#e8e8e8' }}
                  >
                    <Close />
                  </NotebookTaskButton>
                  {this.props.paneTitle}
                </div>
              </div>
              <DeclaredVariablesPane />
              <HistoryPane />
              <AppInfo />
            </MuiThemeProvider>
          </div>
        </Resizable>
      </div>
    )
  }
}

export function mapStateToProps(state) {
  const paneTitle = {
    _CONSOLE: 'Console',
    _APP_INFO: 'App Info',
    DECLARED_VARIABLES: 'Declared Variables',
    _CLOSED: '(pane is closed)',
    undefined: 'PANE MODE UNDEFINED!!',
  }[state.sidePaneMode]

  return {
    viewPaneDisplayStyle: state.sidePaneMode !== '_CLOSED' ? 'flex' : 'none',
    paneHeight: state.sidePaneMode !== '_CLOSED' ? state.paneHeight : 0,
    paneTitle,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changePaneHeight: height => dispatch(changePaneHeight(height)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaneContainerUnconnected)
