import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'

// import Pane from './pane-container'
// import tasks from '../../actions/eval-frame-tasks'
import HistoryItem from './history-item'
import EmptyPaneContents from './empty-pane-contents'

export class HistoryPaneUnconnected extends React.Component {
  static propTypes = {
    history: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.historyScrollerRef = React.createRef()
  }

  shouldComponentUpdate(nextProps) {
    return (!deepEqual(this.props, nextProps)
      && (this.props.sidePaneMode === '_HISTORY'
        || nextProps.sidePaneMode === '_HISTORY')
    )
  }

  componentDidUpdate() {
    // scroll to bottom on update
    this.historyScrollerRef.current.scrollTo({
      top: this.historyScrollerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  render() {
    let histContents = []
    if (this.props.history.length) {
      histContents = this.props.history
        .filter(cell => cell.content.length)
        .map(cell => (<HistoryItem
          display
          content={cell.content}
          cell={cell}
          key={`history-${+cell.lastRan}-${cell.cellID}`}
        />))
    } else {
      histContents.push(<EmptyPaneContents key="no-history">No History</EmptyPaneContents>)
    }

    return (
      <div
        className="pane-content history-cells"
        style={{ display: this.props.paneDisplay }}
        ref={this.historyScrollerRef}
      >
        {histContents}
      </div>
    )
  }
}

export function mapStateToProps(state) {
  return {
    sidePaneMode: state.sidePaneMode,
    history: state.history,
    paneDisplay: state.sidePaneMode === '_HISTORY' ? 'block' : 'none',
  }
}

export default connect(mapStateToProps)(HistoryPaneUnconnected)
