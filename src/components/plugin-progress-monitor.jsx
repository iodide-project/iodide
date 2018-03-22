import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export class PluginProgressMonitorUnconnected extends React.Component {
  static propTypes = {
    cellId: PropTypes.number.isRequired,
  }
  render() {
    return (
      <div> foo
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { cellId } = ownProps
  return {
    cellId,
  }
}

export default connect(mapStateToProps)(PluginProgressMonitorUnconnected)
