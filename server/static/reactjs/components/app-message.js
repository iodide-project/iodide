import React from 'react'
import { connect } from 'react-redux'
import SnackBar from '@material-ui/core/Snackbar'

class appMessageUnconnected extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      latestMessage: {},
    }

    this.handleClose = this.handleClose.bind(this)
  }

  shouldComponentUpdate(props, state) {
    const { latestMessage } = state
    const newMessage = props.appMessage
    if (newMessage === null) return false
    const newTimestamp = newMessage.when.toString()
    const latestTimestamp = latestMessage.when === undefined ?
      undefined : latestMessage.when.toString()
    if (latestTimestamp === undefined || newTimestamp !== latestTimestamp) {
      this.setState({ latestMessage: newMessage, open: true })
    }
    return true
  }

  handleClose() {
    this.setState({ open: false })
  }

  render() {
    return (
      <SnackBar
        open={this.state.open}
        onClose={this.handleClose}
        autoHideDuration={3000}
        message={<span id="message-id">{this.state.latestMessage.message}</span>}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    appMessage: state.appMessage,
  }
}

export default connect(mapStateToProps)(appMessageUnconnected)
