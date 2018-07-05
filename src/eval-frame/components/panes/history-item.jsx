import React from 'react'
import PropTypes from 'prop-types'
import ArrowBack from 'material-ui-icons/ArrowBack'

import PaneContentButton from './pane-content-button'
import { prettyDate } from '../../tools/notebook-utils'
import { postMessageToEditor } from '../../port-to-editor'

export default class HistoryItem extends React.Component {
  static propTypes = {
    cell: PropTypes.shape({
      content: PropTypes.string,
      display: PropTypes.bool,
      cellID: PropTypes.number,
      lastRan: PropTypes.instanceOf(Date),
    }).isRequired,
  }
  constructor(props) {
    super(props)
    this.state = { timeSince: 'just now', hovered: false }
    this.hoverOver = this.hoverOver.bind(this)
    this.showEditorCell = this.showEditorCell.bind(this)
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ timeSince: prettyDate(this.props.cell.lastRan) })
    }, 5000)
  }

  hoverOver(tf) {
    this.setState({ hovered: tf })
  }

  showEditorCell() {
    postMessageToEditor(
      'CLICK_ON_OUTPUT',
      {
        id: this.props.cell.cellID,
        pxFromViewportTop: -1, // aligns to top of editor.
      },
    )
  }

  render() {
    const mainElem = <pre className="history-item-code">{this.props.content}</pre>
    return (
      <div
        onMouseEnter={() => { this.hoverOver(true) }}
        onMouseLeave={() => { this.hoverOver(false) }}
        id={`cell-${this.props.cell.cellID}`}
        className={`${this.props.display ? '' : 'hidden-cell'} `}
      >
        <div className={`cell history-cell ${this.state.hovered ? 'history-hovered' : undefined}`}>
          <div className="history-content editor">{mainElem}</div>
          <div className="history-metadata">
            <div className="history-show-actual-cell">
              <PaneContentButton
                text="scroll to cell"
                onClick={this.showEditorCell}
              >
                <ArrowBack style={{ fontSize: '12px' }} />
              </PaneContentButton>
            </div>
            <div className="history-time-since"> {this.state.timeSince} </div>
            <div
              style={{
              opacity: this.state.hovered ? 1 : 0,
            }}
              className="history-date"
            > / {this.props.cell.lastRan.toUTCString()}
            </div>
          </div>
        </div>
        <div className="cell-controls" />
      </div>
    )
  }
}
