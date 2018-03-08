import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import { connect } from 'react-redux'
import { prettyDate } from '../../notebook-utils'

export class LastSavedTextUnconnected extends React.Component {
  static propTypes = {
    lastSaved: PropTypes.string,
  }
  render() {
    return (
      <Typography
        classes={{ root: 'last-saved-text' }}
      >
        {this.props.lastSaved === undefined ? ' ' : `saved ${prettyDate(this.props.lastSaved)}`}
      </Typography>)
  }
}

function mapStateToProps(state) {
  return {
    lastSaved: state.lastSaved,
  }
}

export default connect(mapStateToProps)(LastSavedTextUnconnected)
