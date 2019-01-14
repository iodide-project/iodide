import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { prettyDate } from "../../tools/notebook-utils";

export class LastSavedTextUnconnected extends React.Component {
  static propTypes = {
    lastSaved: PropTypes.string
  };

  render() {
    return (
      <Typography
        classes={{ root: "last-saved-text" }}
        style={{ marginRight: "10px" }}
      >
        {this.props.lastSaved}
      </Typography>
    );
  }
}

export function mapStateToProps(state) {
  const islastSaved = state.lastSaved === undefined;
  return {
    lastSaved: islastSaved ? "" : `saved ${prettyDate(state.lastSaved)}`
  };
}

export default connect(mapStateToProps)(LastSavedTextUnconnected);
