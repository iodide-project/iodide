import React, {createElement} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import TwoRowCell from './two-row-cell.jsx'
import CellOutput from './output.jsx'
import CellEditor from './cell-editor.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import CheckCircle from 'material-ui/svg-icons/action/check-circle'
import ErrorCircle from 'material-ui/svg-icons/alert/error'
import UnloadedCircle from 'material-ui/svg-icons/content/remove'

class ExternalResourceCell extends React.Component {
  outputComponent = () => {
    if (this.props.value == undefined) return undefined
    let outs = this.props.value.filter(d => d.src !== '').map((d,i) => {
      
      let statusExplanation
      let statusIcon = d.status === undefined
        ? <UnloadedCircle />
        : (d.status === 'loaded'
          ? <CheckCircle color='lightblue' />
          : <ErrorCircle color='firebrick' />
        )
      if (d.hasOwnProperty('statusExplanation')) {
        statusExplanation = <div key={i} className='dependency-status-explanation'>{d.statusExplanation}</div>
      }
      return (
        <div className='dependency-container' key={`erc-${this.props.cellId}-${i}`}>
          <div className='dependency-row'>
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
              {statusIcon}
            </MuiThemeProvider>
            <div className='dependency-src'>{d.src}</div>
          </div>
          {statusExplanation}
        </div>
      )
    })
    return (
      <div className='dependency-output'>
        {outs}
      </div>
    )
  }

  render() {
    return (
      <TwoRowCell
        cellId={this.props.cellId}
        row1 = { <CellEditor cellId={this.props.cellId} /> }
        row2 = { this.outputComponent() }
      />
    )
  }

}



function mapStateToProps(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    value: cell.value,
    cellId: cell.id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExternalResourceCell)

