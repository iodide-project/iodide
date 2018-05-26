import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from 'material-ui/Button'
import SnackBar from 'material-ui/Snackbar'
import tasks from '../../actions/task-definitions'

export class appMessagesUnconnected extends React.Component {
  static propTypes = {
    appMessages: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      latestMessage: {},
    }
  }

  shouldComponentUpdate(props, state) {
    const { latestMessage } = state
    const newMessage = props.appMessages.slice(-1)[0]
    const newTimestamp = newMessage.when.toString()
    const latestTimestamp = latestMessage.when === undefined ?
      undefined : latestMessage.when.toString()
    if (latestTimestamp === undefined || newTimestamp !== latestTimestamp) {
      this.setState({ latestMessage: newMessage, open: true })
    }
    return true
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  handleMore = () => {
    this.setState({ open: false })
    tasks.toggleAppInfoPane.callback()
  }

  render() {
    return (
      <SnackBar
        open={this.state.open}
        onClose={this.handleClose}
        autoHideDuration={5000}
        message={<span id="message-id">{this.state.latestMessage.message}</span>}
        action={
          <Button onClick={this.handleMore} color="secondary" size="small">
              More
          </Button>
      }
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    appMessages: state.appMessages,
  }
}

export default connect(mapStateToProps)(appMessagesUnconnected)
