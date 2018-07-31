import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ArrowBack from '@material-ui/icons/ArrowBack'
import { ValueRenderer } from '../../../components/reps/value-renderer'
import ExternalResourceOutputHandler from '../../../components/reps/output-handler-external-resource'

import PaneContentButton from './pane-content-button'
import { postMessageToEditor } from '../../port-to-editor'

import { prettyDate, getCellById } from '../../tools/notebook-utils'

export class HistoryItemUnconnected extends React.Component {
  static propTypes = {
    cell: PropTypes.shape({
      content: PropTypes.string,
      display: PropTypes.bool,
      cellId: PropTypes.number,
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
        id: this.props.cell.cellId,
        autoScrollToCell: true,
      },
    )
  }

  render() {
    // const id = this.props.cell.cellId
    let cellOutput
    switch (this.props.cellType) {
      case 'code':
      case 'plugin':
        cellOutput = (<ValueRenderer
          render={this.props.render}
          valueToRender={this.props.valueToRender}
        />)
        break
      case 'external dependencies':
        cellOutput = <ExternalResourceOutputHandler value={this.props.valueToRender} />
        break
      case 'css':
        cellOutput = 'Page Styles Updated'
        break
      default:
        // TODO: Use better class for inline error
        cellOutput = <div>Unknown cell type {this.props.cellType}</div>
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
          <div className="history-time-since"> {this.state.timeSince} </div>
          {/* <div className="history-date"> / {this.props.cell.lastRan.toString()}
          </div> */}
        </div>
      </div>)

    return (
      <div id={`cell-${this.props.cell.cellId}-history`} className="history-cell">
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
  const cell = getCellById(state.cells, ownProps.cell.cellId)
  return {
    cellType: cell.cellType,
    valueToRender: cell.value,
    render: cell.rendered,
  }
}

export default connect(mapStateToProps)(HistoryItemUnconnected)
