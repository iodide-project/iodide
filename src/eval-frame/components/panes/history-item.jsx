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
    this.state = { timeSince: 'just now', hovered: false }
    this.hoverOver = this.hoverOver.bind(this)
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ timeSince: prettyDate(this.props.cell.lastRan) })
    }, 5000)
  }

  hoverOver(tf) {
    this.setState({ hovered: tf })
  }

  render() {
    const mainElem = <pre className="history-item-code">{this.props.content}</pre>
    return (
      <div
        onMouseEnter={() => { this.hoverOver(true) }}
        onMouseLeave={() => { this.hoverOver(false) }}
        id={`cell-${this.props.cell.id}`}
        className={`${this.props.display ? '' : 'hidden-cell'} `}
      >
        <div className={`cell history-cell ${this.state.hovered ? 'history-hovered' : undefined}`}>
          <div className="history-content editor">{mainElem}</div>
          <div className="history-metadata">
            <span className="history-time-since"> {this.state.timeSince} </span>
            <span
              style={{
              opacity: this.state.hovered ? 1 : 0,
            }}
              className="history-date"
            > / {this.props.cell.lastRan.toUTCString()}
            </span>
          </div>
        </div>
        <div className="cell-controls" />
      </div>
    )
  }
}
