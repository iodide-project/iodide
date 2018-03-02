import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import SidePane from './side-pane'

import DeclaredVariables from '../declared-variables'
import tasks from '../../task-definitions'

export class DeclaredVariablesPaneUnconnected extends React.Component {
  static propTypes = {
    history: PropTypes.array,
    declaredVariables: PropTypes.object,
  }
  render() {
    return (
      <SidePane task={tasks.toggleDeclaredVariablesPane} title="Declared Variables" openOnMode="declared variables">
        <DeclaredVariables variables={this.props.declaredVariables} />
      </SidePane>
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
