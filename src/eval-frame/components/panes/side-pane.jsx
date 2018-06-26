import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// import Drawer from 'material-ui/Drawer'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
// import Typography from 'material-ui/Typography'
import Close from 'material-ui-icons/Close'

import NotebookTaskButton from '../../../components/menu/notebook-task-button'
import NotebookMenuDivider from '../../../components/menu/notebook-menu-divider'
// import Resizable from 're-resizable'

// import UserTask from '../../../actions/user-task'
// import tasks from '../../actions/eval-frame-tasks'

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
      viewMode: PropTypes.string,
      // task: PropTypes.instanceOf(UserTask),
    }

    render() {
      return (
        <div style={{
          display: this.props.sidePaneMode === this.props.openOnMode
            && this.props.viewMode !== 'presentation' ? 'block' : 'none',
          position: 'fixed',
          bottom: '0px',
          borderTop: '1px solid lightgray',
          backgroundColor: 'white',
          height: this.props.sidePaneWidth,
          width: '100%',
          overflow: 'auto',
        }}
        >
          <MuiThemeProvider theme={theme}>
            <div className="pane-header">
              <div className="pane-title">
                <NotebookTaskButton
                  tooltip="Close"
                  task={this.props.task}// tasks.toggleHistoryPane}
                  style={{ color: 'black', margin: '5px' }}
                >
                  <Close />
                </NotebookTaskButton>
                {this.props.title}

              </div>
              <NotebookMenuDivider />
            </div>
            {this.props.children}
          </MuiThemeProvider>
        </div>
      )
    }
}

export function mapStateToProps(state) {
  return {
    viewMode: state.viewMode,
    sidePaneMode: state.sidePaneMode,
    sidePaneWidth: state.sidePaneWidth,
  }
}

export default connect(mapStateToProps)(SidePaneUnconnected)
