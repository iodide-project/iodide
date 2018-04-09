import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getCellById } from '../../tools/notebook-utils'
import { ValueRenderer } from '../reps/value-renderer'

export class CellOutputUnconnected extends React.Component {
  static propTypes = {
    render: PropTypes.bool.isRequired,
    valueToRender: PropTypes.any,
  }

  render() {
    return (
      <ValueRenderer
        render={this.props.render}
        valueToRender={this.props.valueToRender}
      />
    )
  }
}

export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    valueToRender: cell.value,
    render: cell.rendered,
  }
}

export default connect(mapStateToProps)(CellOutputUnconnected)
