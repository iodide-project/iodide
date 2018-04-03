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

    constructor(props) {
      super(props);

      this.paneOpen = true;
    }

    componentWillReceiveProps(nextProps) {
      if (!this.props.sidePaneMode && nextProps.sidePaneMode) {
        this.paneOpen = true;
      } else {
        this.paneOpen = false;
      }
    }
    render() {
      return (
        <MuiThemeProvider theme={theme}>

          <Drawer
            classes={{ paperAnchorRight: 'side-pane' }}
            variant="persistent"
            anchor="right"
            transitionDuration={this.paneOpen ? 225 : 0}
            open={this.props.sidePaneMode === this.props.openOnMode}
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
