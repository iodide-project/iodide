import React from 'react'
import PropTypes from 'prop-types'
import { ToolbarTitle } from 'material-ui/Toolbar'
import { connect } from 'react-redux'
import { prettyDate } from '../../notebook-utils'

export class LastSavedTextUnconnected extends React.Component {
  static propTypes = {
    lastSaved: PropTypes.object,
  }
  render() {
    return (<ToolbarTitle
      style={{ fontSize: '13px', color: 'lightgray', fontStyle: 'italic' }}
      text={this.props.lastSaved === undefined ? ' ' : `last saved: ${prettyDate(this.props.lastSaved)}`}
    />)
  }
}

function mapStateToProps(state) {
  return {
    lastSaved: state.lastSaved,
  }
}

export default connect(mapStateToProps)(LastSavedTextUnconnected)
