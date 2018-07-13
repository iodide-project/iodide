import React from 'react'
import PropTypes from 'prop-types'
import ArrowBack from '@material-ui/icons/ArrowBack'

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
    this.state = { timeSince: 'just now' }
    this.showEditorCell = this.showEditorCell.bind(this)
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ timeSince: prettyDate(this.props.cell.lastRan) })
    }, 5000)
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
    return (
      <div
        id={`cell-${this.props.cell.cellID}`}
        className={`cell-history-container ${this.props.display ? '' : 'hidden-cell'} `}
      >
        <div className="cell history-cell">
          <div className="history-content editor">
            <pre className="history-item-code">{this.props.content}</pre>
          </div>
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
            <div className="history-date"> / {this.props.cell.lastRan.toString()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
