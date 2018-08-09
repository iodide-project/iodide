import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getCellById } from '../../tools/notebook-utils'

export class CSSOutputUnconnected extends React.Component {
  static propTypes = {
    style: PropTypes.string.isRequired,
  }

  render() {
    return <style>{this.props.style}</style>
  }
}


export function mapStateToProps(state, ownProps) {
  const cell = getCellById(state.cells, ownProps.cellId)
  return {
    style: cell.rendered ? cell.value : '',
  }
}

export default connect(mapStateToProps)(CSSOutputUnconnected)
