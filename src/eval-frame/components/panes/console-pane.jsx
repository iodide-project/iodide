import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'

import HistoryItem from './history-item'
import ConsoleInput from './console-input'
import EmptyPaneContents from './empty-pane-contents'

export class HistoryPaneUnconnected extends React.Component {
  static propTypes = {
    history: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.historyScrollerRef = React.createRef()
  }

  // shouldComponentUpdate(nextProps) {
  //   return (!deepEqual(this.props, nextProps)
  //     && (this.props.sidePaneMode === '_CONSOLE'
  //       || nextProps.sidePaneMode === '_CONSOLE')
  //   )
  // }

  shouldComponentUpdate(nextProps) {
    return (!deepEqual(this.props, nextProps)
      && (this.props.paneVisible || nextProps.paneVisible)
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
        .filter(historyItem => historyItem.content.length)
        .map(historyItem => (<HistoryItem
          content={historyItem.content}
          historyItem={historyItem}
          key={`history-${historyItem.lastRan}-${historyItem.historyId}`}
        />))
    } else {
      histContents.push(<EmptyPaneContents key="no-history">No History</EmptyPaneContents>)
    }

    return (
      <div
        className="pane-content"
        style={{
          // display: this.props.paneDisplay,
          overflow: 'hidden',
        }}
      >
        <div
          className="console-pane"
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          <div
            className="history-cells"
            style={{
              flexGrow: 1,
              maxHeight: '100%',
              overflow: 'auto',
            }}
            ref={this.historyScrollerRef}
          >
            {histContents}
          </div>
          <ConsoleInput />
        </div>
      </div>
    )
  }
}

export function mapStateToProps(state) {
  return {
    // sidePaneMode: state.sidePaneMode,
    history: state.history,
    paneVisible: state.panePositions.ConsolePositioner.display === 'block',
    // paneDisplay: state.sidePaneMode === '_CONSOLE' ? 'flex' : 'none',
  }
}

export default connect(mapStateToProps)(HistoryPaneUnconnected)
