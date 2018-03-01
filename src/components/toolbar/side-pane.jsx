import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Drawer from 'material-ui/Drawer'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Close from 'material-ui-icons/Close'
import NotebookTaskButton from './notebook-task-button'
import NotebookMenuDivider from './notebook-menu-divider'

import UserTask from '../../user-task'

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
})

export class SidePaneUnconnected extends React.Component {
    static propTypes = {
      sidePaneMode: PropTypes.string,
      title: PropTypes.string,
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
            docked={false}
            open={this.props.sidePaneMode === this.props.openOnMode}
            openSecondary
            overlayStyle={{ backgroundColor: 'none' }}
            onRequestChange={() => { this.props.task.callback() }}
          >
            <div className="pane-title">
              <NotebookTaskButton
                tooltip="Close"
                task={this.props.task}// tasks.toggleHistoryPane}
                style={{ color: 'black', margin: '5px' }}
              >
                <Close />
              </NotebookTaskButton>
              <Typography variant="headline">{this.props.title}</Typography>
            </div>
            <NotebookMenuDivider />

            {this.props.children}
          </Drawer>
        </MuiThemeProvider>

      )
    }
}

export function mapStateToProps(state) {
  return {
    sidePaneMode: state.sidePaneMode,
  }
}

export default connect(mapStateToProps)(SidePaneUnconnected)
