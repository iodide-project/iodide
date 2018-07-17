import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// import Drawer from '@material-ui/core/Drawer'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import Resizable from 're-resizable'

import NotebookTaskButton from '../../../components/menu/notebook-task-button'

import { changePaneHeight } from '../../actions/actions'

import tasks from '../../actions/eval-frame-tasks'

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
})

export class PaneContainerUnconnected extends React.Component {
  static propTypes = {
    sidePaneMode: PropTypes.string,
    title: PropTypes.string,
    paneHeight: PropTypes.number,
    openOnMode: PropTypes.string,
    changePaneHeight: PropTypes.func.isRequired,
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
      <Resizable
        enable={{ top: true }}
        size={{ height: this.props.paneHeight, width: '100%' }}
        handleClasses={{ top: 'resizer' }}
        onResizeStop={this.onResizeStopHandler}
      >
        <div
          className="view-pane"
          style={{ display: this.props.viewPaneDisplayStyle }}
        >
          <MuiThemeProvider theme={theme}>
            <div className="pane-header">
              <div className="pane-title">
                <NotebookTaskButton
                  tooltip="Close"
                  task={this.props.closePanes}
                  style={{ color: 'black', margin: '5px' }}
                >
                  <Close />
                </NotebookTaskButton>
                {this.props.paneTitle}
              </div>
            </div>
            {this.props.children}
          </MuiThemeProvider>
        </div>
      </Resizable>
    )
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    // viewMode: state.viewMode,
    sidePaneMode: state.sidePaneMode,
    // paneHeight: state.paneHeight,
    viewPaneDisplayStyle: state.sidePaneMode === ownProps.openOnMode ? 'block' : 'none',
    paneHeight: state.sidePaneMode === ownProps.openOnMode ? state.paneHeight : 0,
    closePanes: tasks.closePanes,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changePaneHeight: height => dispatch(changePaneHeight(height)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaneContainerUnconnected)
