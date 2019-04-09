import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SnackBar from "@material-ui/core/Snackbar";

export class appMessagesUnconnected extends React.Component {
  static propTypes = {
    appMessages: PropTypes.arrayOf(PropTypes.object)
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      latestMessage: {}
    };
  }

  shouldComponentUpdate(props, state) {
    const { latestMessage } = state;
    const newMessage = props.appMessages.slice(-1)[0];
    if (newMessage === undefined) return false;
    const newTimestamp = newMessage.when.toString();
    const latestTimestamp =
      latestMessage.when === undefined
        ? undefined
        : latestMessage.when.toString();
    if (latestTimestamp === undefined || newTimestamp !== latestTimestamp) {
      this.setState({ latestMessage: newMessage, open: true });
    }
    return true;
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleMore = () => {
    // FIXME: should show the AppInfo tab
    // this.setState({ open: false })
    // if (this.props.sidePaneMode !== '_APP_INFO') { tasks.toggleAppInfoPane.callback() }
  };

  render() {
    return (
      <SnackBar
        open={this.state.open}
        onClose={this.handleClose}
        autoHideDuration={5000}
        message={
          <span id="message-id">{this.state.latestMessage.message}</span>
        }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    appMessages: state.appMessages
  };
}

export default connect(mapStateToProps)(appMessagesUnconnected);
