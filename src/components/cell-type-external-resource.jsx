import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {GenericCell} from './cell.jsx'
import CellOutput from './output.jsx'

import actions from '../actions.js'
import {getCellById} from '../notebook-utils.js'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import CheckCircle from 'material-ui/svg-icons/action/check-circle'
import ErrorCircle from 'material-ui/svg-icons/alert/error'
import UnloadedCircle from 'material-ui/svg-icons/content/remove'


class ExternalDependencyCell extends GenericCell {
  constructor(props) {
    super(props)
  }

  outputComponent() {
    if (this.props.cell.value == undefined) return undefined
    let outs = this.props.cell.value.map((d) => {
      let statusExplanation
      let statusIcon = d.status === undefined
        ? <UnloadedCircle />
        : (d.status === 'loaded'
          ? <CheckCircle color='lightblue' />
          : <ErrorCircle color='firebrick' />

        )
      if (d.hasOwnProperty('statusExplanation')) {
        statusExplanation = <div className='dependency-status-explanation'>{d.statusExplanation}</div>
      }
      return (
        <div className='dependency-container'>
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
}





function mapStateToPropsForCells(state, ownProps) {
  let cell = getCellById(state.cells, ownProps.cellId)
  return {
    display: true,
    pageMode: state.mode,
    viewMode: state.viewMode,
    ref: 'cell' + cell.id,
    cell: Object.assign({}, cell),
    id: cell.id,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

const connectedCell = connect(mapStateToPropsForCells, mapDispatchToProps)(ExternalDependencyCell)
export {connectedCell as ExternalDependencyCell}

