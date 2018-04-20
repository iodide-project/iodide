import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from 'material-ui/Button'
import SnackBar from 'material-ui/Snackbar'

const action = (
  <Button color="secondary" size="small">
    More
  </Button>
);

export class appMessagesUnconnected extends React.Component {
  static propTypes = {
    appMessages: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      latestMessage: undefined,
    }
  }

  shouldComponentUpdate(props, state) {
    const { latestMessage } = state
    const newMessage = props.appMessages.slice(-1)[0]
    if (latestMessage !== newMessage) this.setState({ latestMessage: newMessage, open: true })
    return true
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  render() {
    return (
      <SnackBar
        open={this.state.open}
        onClose={this.handleClose}
        SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
        autoHideDuration={5000}
        message={<span id="message-id">{this.state.latestMessage}</span>}
        action={action}
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
