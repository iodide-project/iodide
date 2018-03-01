import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// import { ToolbarGroup } from 'material-ui/Toolbar'
import Drawer from 'material-ui/Drawer'
// import Close from 'material-ui/svg-icons/navigation/close'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Typography from 'material-ui/Typography'
import Close from 'material-ui-icons/Close'
import NotebookTaskButton from './notebook-task-button'
import NotebookMenuDivider from './notebook-menu-divider'

import DeclaredVariables from '../declared-variables'
import tasks from '../../task-definitions'


const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
})


export class DeclaredVariablesPaneUnconnected extends React.Component {
    static propTypes = {
      sidePaneMode: PropTypes.string,
      declaredVariables: PropTypes.object,
    }

    static muiName ='Drawer'

    render() {
      return (
        <MuiThemeProvider theme={theme}>

          <Drawer
            classes={{ paperAnchorRight: 'side-pane' }}
            variant="persistent"
            anchor="right"
            docked={false}
            open={this.props.sidePaneMode === 'declared variables'}
            openSecondary
            overlayStyle={{ backgroundColor: 'none' }}
            onRequestChange={() => { tasks.toggleDeclaredVariablesPane.callback() }}
          >
            <div className="pane-title">
              <NotebookTaskButton
                tooltip="Close"
                task={tasks.toggleDeclaredVariablesPane}
                style={{ color: 'black', margin: '5px' }}
              >
                <Close />
              </NotebookTaskButton>
              <Typography variant="headline">Declared Variables</Typography>
            </div>
            <NotebookMenuDivider />
            <DeclaredVariables variables={this.props.declaredVariables} />
          </Drawer>
        </MuiThemeProvider>

      )
    }
}
//            <h1 className="overlay-title">Declared Variables</h1>


function mapStateToProps(state) {
  return {
    declaredVariables: state.userDefinedVariables,
    sidePaneMode: state.sidePaneMode,
  }
}

export default connect(mapStateToProps)(DeclaredVariablesPaneUnconnected)
