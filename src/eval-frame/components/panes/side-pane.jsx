import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// import Drawer from 'material-ui/Drawer'
// import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
// import Typography from 'material-ui/Typography'
// import Resizable from 're-resizable'

// import UserTask from '../../../actions/user-task'
// import tasks from '../../actions/eval-frame-tasks'

// const theme = createMuiTheme({
//   palette: {
//     type: 'light',
//   },
// })

export class SidePaneUnconnected extends React.Component {
    static propTypes = {
      sidePaneMode: PropTypes.string,
      title: PropTypes.string,
      sidePaneWidth: PropTypes.number,
      openOnMode: PropTypes.string,
      // task: PropTypes.instanceOf(UserTask),
    }

    render() {
      return (
        <div style={{
          display: true, // this.props.sidePaneMode === this.props.openOnMode ? 'block' : 'none',
          borderTop: '4px solid black',
        }}
        >
          <div className="pane-header">
            <div className="pane-title">
              <h2>{this.props.title}</h2>
            </div>
          </div>

          {this.props.children}
        </div>
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
