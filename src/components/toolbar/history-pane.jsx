import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Drawer from 'material-ui/Drawer'
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// import getMuiTheme from 'material-ui/styles/getMuiTheme'
// import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
// import Close from 'material-ui/svg-icons/navigation/close'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Typography from 'material-ui/Typography'
import Close from 'material-ui-icons/Close'
import NotebookTaskButton from './notebook-task-button'
import NotebookMenuDivider from './notebook-menu-divider'

import { HistoryItem } from '../history-item'
import tasks from '../../task-definitions'

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
})

export class HistoryPaneUnconnected extends React.Component {
    static propTypes = {
      sidePaneMode: PropTypes.string,
      history: PropTypes.array,
    }
    static muiName = 'Drawer'
    render() {
      let histContents = []
      if (this.props.history.length) {
        histContents = this.props.history.filter(cell => cell.content.length).map((cell, i) => {
        // TODO: Don't use array indices in keys (See react/no-array-index-key linter)
        const cellComponent = <HistoryItem display ref={`cell${cell.id}`} cell={cell} id={`${i}-${cell.id}`} key={`history${i}`} />  // eslint-disable-line
          return cellComponent
        })
      } else {
        histContents.push(<div className="no-history" key="history_empty">No History</div>)
      }
      return (
        <MuiThemeProvider theme={theme}>

          <Drawer
            classes={{ paperAnchorRight: 'side-pane' }}
            variant="persistent"
            anchor="right"
            docked={false}
            open={this.props.sidePaneMode === 'history'}
            openSecondary
            overlayStyle={{ backgroundColor: 'none' }}
            onRequestChange={() => { tasks.toggleHistoryPane.callback() }}
          >
            <div className="pane-title">
              <NotebookTaskButton
                tooltip="Close"
                task={tasks.toggleHistoryPane}
                style={{ color: 'black', margin: '5px' }}
              >
                <Close />
              </NotebookTaskButton>
              <Typography variant="headline">History</Typography>
            </div>
            <NotebookMenuDivider />
            <div className="history-cells"> {histContents} </div>
          </Drawer>
        </MuiThemeProvider>

      )
    }
}

export function mapStateToProps(state) {
  return {
    sidePaneMode: state.sidePaneMode,
    history: state.history,
  }
}

export default connect(mapStateToProps)(HistoryPaneUnconnected)
