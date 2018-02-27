import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ToolbarGroup } from 'material-ui/Toolbar'
import Drawer from 'material-ui/Drawer'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import Close from 'material-ui/svg-icons/navigation/close'

import NotebookTaskButton from './notebook-task-button'

import { HistoryItem } from '../history-item'
import tasks from '../../task-definitions'

export class HistoryPaneUnconnected extends React.Component {
    static propTypes = {
      sidePaneMode: PropTypes.string,
      history: PropTypes.array,
    }

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
        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
          <Drawer
            width={600}
            docked={false}
            open={this.props.sidePaneMode === 'history'}
            openSecondary
            overlayStyle={{ backgroundColor: 'none' }}
            onRequestChange={() => { tasks.toggleHistoryPane.callback() }}
          >
            <ToolbarGroup id="notebook-view-mode-controls" className="mode-buttons" style={{ float: 'left' }}>
              <NotebookTaskButton
                tooltip="Close"
                task={tasks.toggleHistoryPane}
                style={{ color: '#fafafa', margin: '5px' }}
              >
                <Close />

              </NotebookTaskButton>


            </ToolbarGroup>
            <h1 className="overlay-title">Execution History</h1>
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
