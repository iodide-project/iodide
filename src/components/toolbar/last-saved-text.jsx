import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import { connect } from 'react-redux'
import { prettyDate } from '../../notebook-utils'

export class LastSavedTextUnconnected extends React.Component {
  static propTypes = {
    lastSaved: PropTypes.object,
  }
  render() {
    return (
      <Typography
        style={{
          fontSize: '13px',
          color: 'lightgray',
          fontStyle: 'italic',
          width: '200px',
          textAlign: 'right',
}}
      >
        {this.props.lastSaved === undefined ? ' ' : `last saved: ${prettyDate(this.props.lastSaved)}`}
      </Typography>)
  }
}

function mapStateToProps(state) {
  return {
    lastSaved: state.lastSaved,
  }
}

export default connect(mapStateToProps)(LastSavedTextUnconnected)
