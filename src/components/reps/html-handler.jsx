import React from "react";
import PropTypes from "prop-types";

export default class HTMLRenderer extends React.Component {
  static propTypes = {
    htmlString: PropTypes.string.isRequired
  };

  render() {
    return <iframe title="htmlRep" srcDoc={this.props.htmlString} />;
  }
}
