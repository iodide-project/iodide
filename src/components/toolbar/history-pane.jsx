import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import SidePane from './side-pane'
import tasks from '../../task-definitions'

export class HistoryPaneUnconnected extends React.Component {
  static propTypes = {
    history: PropTypes.array,
  }
  render() {
    let histContents = []
    if (this.props.history.length) {
      histContents = this.props.history.filter(cell => cell.content.length).map((cell, i) => {
      // TODO: Don't use array indices in keys (See react/no-array-index-key linter)
      const cellComponent = <HistoryItem display ref={`cell${cell.id}`} cell={cell} id={`${i}-${cell.id}`} key={`history${i}`} />  // eslint-disable-line
        return cellComponent
      })
    } else {
      histContents.push(<div className="no-history" key="history_empty">No History</div>)
    }
    return (
      <SidePane task={tasks.toggleHistoryPane} title="History" openOnMode="history">
        <div className="history-cells"> {histContents} </div>
      </SidePane>
    )
  }
}

export function mapStateToProps(state) {
  return {
    sidePaneMode: state.sidePaneMode,
    history: state.history,
  }
}

export default connect(mapStateToProps)(HistoryPaneUnconnected)
