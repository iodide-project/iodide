import React from 'react'

import PropTypes from 'prop-types'
import { prettyDate } from '../../tools/notebook-utils'

export default class HistoryItem extends React.Component {
  static propTypes = {
    cell: PropTypes.shape({
      // id: PropTypes.number.isRequired,
      content: PropTypes.string,
      display: PropTypes.bool,
      lastRan: PropTypes.instanceOf(Date),
    }).isRequired,
  }
  constructor(props) {
    super(props)
    // set up a timer here
    this.state = { timeSince: 'just now', fullDate: false }
    this.showFullDate = this.showFullDate.bind(this)
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ timeSince: prettyDate(this.props.cell.lastRan) })
    }, 5000)
  }

  showFullDate(tf) {
    this.setState({ fullDate: tf })
  }

  render() {
    const mainElem = <pre className="history-item-code">{this.props.content}</pre>
    return (
      <div
        onMouseEnter={() => { this.showFullDate(true) }}
        onMouseLeave={() => { this.showFullDate(false) }}
        id={`cell-${this.props.cell.id}`}
        className={`${this.props.display ? '' : 'hidden-cell'}`}
      >
        <div className="cell history-cell">
          <div className="history-content editor">{mainElem}</div>
          <span className="history-time-since">{this.state.timeSince}
          </span>
          <span
            style={{
              opacity: this.state.fullDate ? 1 : 0,
            }}
            className="history-date"
          >{this.props.cell.lastRan.toUTCString()}
          </span>
        </div>
        <div className="cell-controls" />
      </div>
    )
  }
}
