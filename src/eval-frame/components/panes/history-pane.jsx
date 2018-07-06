import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Pane from './pane-container'
import tasks from '../../actions/eval-frame-tasks'
import HistoryItem from './history-item'
import EmptyPaneContents from './empty-pane-contents'

export class HistoryPaneUnconnected extends React.Component {
  static propTypes = {
    history: PropTypes.array,
  }
  render() {
    let histContents = []
    if (this.props.history.length) {
      histContents = this.props.history.filter(cell => cell.content.length).map((cell) => {
        const cellComponent = (<HistoryItem
          display
          content={cell.content}
          cell={cell}
          key={`history-${+cell.lastRan}-${cell.cellID}`}
        />)
        return cellComponent
      })
    } else {
      histContents.push(<EmptyPaneContents key="no-history">No History</EmptyPaneContents>)
    }
    histContents.reverse()
    return (
      <Pane task={tasks.toggleHistoryPane} title="History" openOnMode="_HISTORY">
        <div className="history-cells"> {histContents} </div>
      </Pane>
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
