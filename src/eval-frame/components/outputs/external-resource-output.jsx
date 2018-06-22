import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import OutputRow from './output-row'
import { OutputContainer } from './output-container'
import ExternalResourceOutputHandler from '../../../components/reps/output-handler-external-resource'

import { getCellById } from '../../tools/notebook-utils'

export class ExternalResourceOutputUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
    value: PropTypes.array,
  }

  render() {
    return (
      <OutputContainer cellId={this.props.cellId}>
        <OutputRow cellId={this.props.cellId} rowType="output">
          <ExternalResourceOutputHandler value={this.props.value} />
        </OutputRow>
      </OutputContainer>
    )
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    value: cell.value,
    cellId: cell.id,
  }
}

export default connect(mapStateToProps)(ExternalResourceOutputUnconnected)
