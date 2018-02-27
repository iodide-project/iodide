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

import DeclaredVariables from '../declared-variables'
import tasks from '../../task-definitions'


export class DeclaredVariablesPaneUnconnected extends React.Component {
    static propTypes = {
      sidePaneMode: PropTypes.string,
      declaredVariables: PropTypes.object,
    }

    render() {
      return (
        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
          <Drawer
            width={600}
            docked={false}
            open={this.props.sidePaneMode === 'declared variables'}
            openSecondary
            overlayStyle={{ backgroundColor: 'none' }}
            onRequestChange={() => { tasks.toggleDeclaredVariablesPane.callback() }}
          >
            <ToolbarGroup id="notebook-view-mode-controls" className="mode-buttons" style={{ float: 'left' }}>
              <NotebookTaskButton
                tooltip="Close"
                task={tasks.toggleDeclaredVariablesPane}
                style={{ color: '#fafafa', margin: '5px' }}
              >
                <Close />

              </NotebookTaskButton>

            </ToolbarGroup>
            <h1 className="overlay-title">Declared Variables</h1>
            <DeclaredVariables variables={this.props.declaredVariables} />
          </Drawer>
        </MuiThemeProvider>
      )
    }
}

function mapStateToProps(state) {
  return {
    declaredVariables: state.userDefinedVariables,
    sidePaneMode: state.sidePaneMode,
  }
}

export default connect(mapStateToProps)(DeclaredVariablesPaneUnconnected)
