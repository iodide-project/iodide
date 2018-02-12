import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import CheckCircle from 'material-ui/svg-icons/action/check-circle'
import ErrorCircle from 'material-ui/svg-icons/alert/error'
import UnloadedCircle from 'material-ui/svg-icons/content/remove'
import PropTypes from 'prop-types';

import TwoRowCell from './two-row-cell'
import CellEditor from './cell-editor'

import actions from '../actions'
import { getCellById } from '../notebook-utils'

class ExternalResourceCell extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    cellId: PropTypes.number.isRequired,
    action: PropTypes.shape({
      bindActionCreators: PropTypes.func.isRequired,
    }).isRequired,
  }

  outputComponent = () => {
    if (this.props.value === undefined) return undefined
    const outs = this.props.value.filter(d => d.src !== '').map((d, i) => {
      let statusExplanation
      let statusIcon
      if (d.status === undefined) {
        statusIcon = <UnloadedCircle />
      } else {
        statusIcon = (d.status === 'loaded'
          ? <CheckCircle color="lightblue" />
          : <ErrorCircle color="firebrick" />
        )
      }
      if (Object.prototype.hasOwnProperty.call(d, 'statusExplanation')) {
        // TODO: Don't use an array index as a key here (See react/no-array-index-key linter)
        statusExplanation = <div key={i} className="dependency-status-explanation">{d.statusExplanation}</div>  // eslint-disable-line
      }
      return (
        // TODO: Don't use an array index as a key here (See react/no-array-index-key linter)
        /* eslint-disable */
        <div className="dependency-container" key={`erc-${this.props.cellId}-${i}`}>
          <div className="dependency-row">
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
              {statusIcon}
            </MuiThemeProvider>
            <div className="dependency-src">{d.src}</div>
          </div>
          {statusExplanation}
        </div>
        /* eslint-enable */
      )
    })
    return (
      <div className="dependency-output">
        {outs}
      </div>
    )
  }

  render() {
    return (
      <TwoRowCell
        cellId={this.props.cellId}
        row1={<CellEditor cellId={this.props.cellId} />}
        row2={this.outputComponent()}
      />
    )
  }
}


function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
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
