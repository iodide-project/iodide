import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import CellRow from './cell-row'
import { CellContainer } from './cell-container'

import * as actions from '../../actions/actions'
import { getCellById } from '../../tools/notebook-utils'


export class MarkdownCellUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.string,
  }

  render() {
    return (
      <CellContainer cellId={this.props.cellId}>
        <CellRow cellId={this.props.cellId} rowType="output">
          <div
            className="user-markdown"
            dangerouslySetInnerHTML={{ __html: this.props.value }} // eslint-disable-line
          />
        </CellRow>
      </CellContainer>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    value: cell.value,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarkdownCellUnconnected)
