import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ArrowBack from '@material-ui/icons/ArrowBack'
import { ValueRenderer } from '../../../components/reps/value-renderer'
import ExternalResourceOutputHandler from '../../../components/reps/output-handler-external-resource'

import PaneContentButton from './pane-content-button'
import { postMessageToEditor } from '../../port-to-editor'

// import {
//   // prettyDate,
//   getCellById,
// } from '../../tools/notebook-utils'

export class HistoryItemUnconnected extends React.Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    cellId: PropTypes.number.isRequired,
    lastRan: PropTypes.number.isRequired,
  }
  constructor(props) {
    super(props)
    // this.state = { timeSince: 'just now' }
    this.showEditorCell = this.showEditorCell.bind(this)
  }

  // componentDidMount() {
  //   setInterval(() => {
  //     this.setState({ timeSince: prettyDate(new Date(this.props.lastRan)) })
  //   }, 5000)
  // }

  showEditorCell() {
    postMessageToEditor(
      'CLICK_ON_OUTPUT',
      {
        id: this.props.cellId,
        autoScrollToCell: true,
      },
    )
  }

  render() {
    // const id = this.props.cell.cellId
    let cellOutput
    switch (this.props.historyType) {
      case 'CELL_EVAL_VALUE':
        cellOutput = (<ValueRenderer
          render
          valueToRender={this.props.valueToRender}
        />)
        break
      case 'CELL_EVAL_EXTERNAL_RESOURCE':
        cellOutput = <ExternalResourceOutputHandler value={this.props.valueToRender} />
        break
      case 'CELL_EVAL_INFO':
        cellOutput = this.props.valueToRender
        break
      default:
        // TODO: Use better class for inline error
        cellOutput = <div>Unknown history type {this.props.historyType}</div>
        break
    }

    const historyMetadata = (
      <div className="history-metadata-positioner">
        <div className="history-metadata">
          <div className="history-show-actual-cell">
            <PaneContentButton
              text="scroll to cell"
              onClick={this.showEditorCell}
            >
              <ArrowBack style={{ fontSize: '12px' }} />
            </PaneContentButton>
          </div>
          {/* <div className="history-time-since"> {this.state.timeSince} </div> */}
        </div>
      </div>)

    return (
      <div id={`cell-${this.props.cellId}-history`} className="history-cell">
        <div className="history-content editor">
          {historyMetadata}
          <pre className="history-item-code">{this.props.content}</pre>
        </div>
        <div className="history-item-output">
          {cellOutput}
        </div>
      </div>
    )
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    cellId: ownProps.historyItem.cellId,
    content: ownProps.historyItem.content,
    historyType: ownProps.historyItem.historyType,
    lastRan: ownProps.historyItem.lastRan,
    valueToRender: ownProps.historyItem.value,
  }
}

export default connect(mapStateToProps)(HistoryItemUnconnected)
