import React from 'react'

import PropTypes from 'prop-types';

export default class HistoryItem extends React.Component {
  static propTypes = {
    cell: PropTypes.shape({
      // id: PropTypes.number.isRequired,
      content: PropTypes.string,
      display: PropTypes.bool,
      lastRan: PropTypes.instanceOf(Date),
    }).isRequired,
  }

  render() {
    const mainElem = <pre>{this.props.content}</pre>
    return (
      <div
        id={`cell-${this.props.cell.id}`}
        className={`cell-container ${this.props.display ? '' : 'hidden-cell'}`}
      >
        <div className="cell history-cell">
          <div className="history-content editor">{mainElem}</div>
          <div className="history-date">{this.props.cell.lastRan.toUTCString()}</div>
        </div>
        <div className="cell-controls" />
      </div>
    )
  }
}
