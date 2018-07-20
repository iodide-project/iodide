import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'
// import Pane from './pane-container'
import CellsList from '../cells-list'

export class ConsolePaneUnconnected extends React.Component {
  static propTypes = {
    history: PropTypes.array,
  }

  shouldComponentUpdate(nextProps) {
    return (!deepEqual(this.props, nextProps)
      && (this.props.sidePaneMode === '_CONSOLE'
        || nextProps.sidePaneMode === '_CONSOLE')
    )
  }

  render() {
    return (
      <CellsList
        id="console-cells"
        className="pane-content"
        containingPane="CONSOLE_PANE"
        style={{ display: this.props.paneDisplay }}
      />
    )
  }
}

export function mapStateToProps(state) {
  return {
    sidePaneMode: state.sidePaneMode,
    paneDisplay: state.sidePaneMode === '_CONSOLE' ? 'block' : 'none',
  }
}

export default connect(mapStateToProps)(ConsolePaneUnconnected)
