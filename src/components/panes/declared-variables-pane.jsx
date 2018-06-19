import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'

import SidePane from './side-pane'

import { DeclaredVariable } from './declared-variable'
import { FrozenVariable } from './frozen-variable'
import tasks from '../../actions/task-definitions'


export class DeclaredVariablesPaneUnconnected extends React.Component {
  static propTypes = {
    userDefinedVarNames: PropTypes.arrayOf(PropTypes.string),
    environmentVariables: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps)
  }

  render() {
    const edvElem = Object.keys(this.props.environmentVariables).length !== 0 ? (
      <div className="declared-variables-list">
        <h3>Saved Environment</h3>
        <div className="frozen-variables">
          {Object.keys(this.props.environmentVariables).map(varName =>
        (<FrozenVariable
          varName={varName}
          byteLength={this.props.environmentVariables[varName][1].length}
          key={varName}
        />))}
        </div>
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

export function mapStateToProps(state) {
  return {
    environmentVariables: state.savedEnvironment,
    userDefinedVarNames: state.userDefinedVarNames,
    sidePaneMode: state.sidePaneMode,
  }
}

export default connect(mapStateToProps)(DeclaredVariablesPaneUnconnected)
