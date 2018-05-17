import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'

import SidePane from './side-pane'

import { DeclaredVariable } from './declared-variable'
import tasks from '../../actions/task-definitions'


export class DeclaredVariablesPaneUnconnected extends React.Component {
  static propTypes = {
    userDefinedVarNames: PropTypes.arrayOf(PropTypes.string),
    environmentVariables: PropTypes.arrayOf(PropTypes.string),
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps)
  }

  render() {
    const environmentalDVs = Object.keys(this.props.environmentVariables).length ?
      Object.keys(this.props.environmentVariables).map(varName =>
        (<DeclaredVariable
          value={this.props.environmentVariables[varName][0]}
          varName={varName}
          key={varName}
        />)) :
      undefined
    const edvElem = environmentalDVs !== undefined ? (
      <div className="declared-variables-list">
        <h3>Saved Environment</h3>
        {environmentalDVs}
      </div>
    ) : undefined

    const declaredVariables = this.props.userDefinedVarNames.length ? (
      <div className="declared-variables-list">
        <h3>User Defined Variables</h3>
        {this.props.userDefinedVarNames
        .map(varName =>
          <DeclaredVariable value={window[varName]} varName={varName} key={varName} />)
        }
      </div>
    ) : undefined
    return (
      <SidePane task={tasks.toggleDeclaredVariablesPane} title="Declared Variables" openOnMode="declared variables">
        {edvElem}
        {declaredVariables}
      </SidePane>
    )
  }
}

function mapStateToProps(state) {
  return {
    environmentVariables: state.savedEnvironment,
    userDefinedVarNames: state.userDefinedVarNames,
    sidePaneMode: state.sidePaneMode,
  }
}

export default connect(mapStateToProps)(DeclaredVariablesPaneUnconnected)
