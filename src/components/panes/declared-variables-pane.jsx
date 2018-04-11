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
  }

  shouldComponentUpdate(nextProps) {
    return !deepEqual(this.props, nextProps)
  }

  render() {
    return (
      <SidePane task={tasks.toggleDeclaredVariablesPane} title="Declared Variables" openOnMode="declared variables">
        <div className="declared-variables-list">
          {this.props.userDefinedVarNames.map(varName =>
            <DeclaredVariable varName={varName} key={varName} />)
          }
        </div>
      </SidePane>
    )
  }
}

function mapStateToProps(state) {
  return {
    userDefinedVarNames: state.userDefinedVarNames,
    sidePaneMode: state.sidePaneMode,
  }
}

export default connect(mapStateToProps)(DeclaredVariablesPaneUnconnected)
