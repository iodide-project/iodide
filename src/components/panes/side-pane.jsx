import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Drawer from '@material-ui/core/Drawer'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Close from '@material-ui/icons/Close'
import Resizable from 're-resizable'
import NotebookTaskButton from '../menu/notebook-task-button'
import NotebookMenuDivider from '../menu/notebook-menu-divider'

import UserTask from '../../actions/user-task'
import tasks from '../../actions/task-definitions'

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
})

export class SidePaneUnconnected extends React.Component {
    static propTypes = {
      sidePaneMode: PropTypes.string,
      title: PropTypes.string,
      sidePaneWidth: PropTypes.number,
      openOnMode: PropTypes.string,
      task: PropTypes.instanceOf(UserTask),
    }
    static muiName = 'Drawer'

    render() {
      return (
        <MuiThemeProvider theme={theme}>
          <Drawer
            classes={{ paperAnchorRight: 'side-pane' }}
            variant="persistent"
            anchor="right"
            transitionDuration={0}
            open={this.props.sidePaneMode === this.props.openOnMode}
          >
            <Resizable
              enable={{
                bottom: false,
                top: false,
                right: false,
                topRight: false,
                bottomRight: false,
                bottomLeft: false,
                topLeft: false,
                left: true,
              }}
              handleClasses={{ left: 'resizer' }}
              maxWidth={800}
              minWidth={300}
              size={{
                width: this.props.sidePaneMode === this.props.openOnMode ?
                       this.props.sidePaneWidth :
                       300,
                height: '999999px',
              }}
              onResizeStop={(e, direction, ref, d) => {
                tasks.changeSidePaneWidth.callback(d.width)
              }}
              style={{ overflow: 'scroll' }}
            >
              <div className="pane-header">
                <div className="pane-title">
                  <Typography variant="headline">{this.props.title}</Typography>
                  <NotebookTaskButton
                    tooltip="Close"
                    task={this.props.task}// tasks.toggleHistoryPane}
                    style={{ color: 'black', margin: '5px' }}
                  >
                    <Close />
                  </NotebookTaskButton>
                </div>
                <NotebookMenuDivider />
              </div>

              {this.props.children}
            </Resizable>
          </Drawer>
        </MuiThemeProvider>

      )
    }
}

export function mapStateToProps(state) {
  return {
    sidePaneMode: state.sidePaneMode,
    sidePaneWidth: state.sidePaneWidth,
  }
}

export default connect(mapStateToProps)(SidePaneUnconnected)
