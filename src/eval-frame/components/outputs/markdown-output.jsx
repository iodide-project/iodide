import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import OutputRow from './output-row'
import OutputContainer from './output-container'

import { getCellById } from '../../tools/notebook-utils'

export class MarkdownOutputUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.string,
  }

  render() {
    return (
      <OutputContainer cellId={this.props.cellId}>
        <OutputRow cellId={this.props.cellId} rowType="output">
          <div
            className="user-markdown"
            dangerouslySetInnerHTML={{ __html: this.props.value }} // eslint-disable-line
          />
        </OutputRow>
      </OutputContainer>
    )
  }
}

export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    value: cell.value,
  }
}

export default connect(mapStateToProps)(MarkdownOutputUnconnected)
