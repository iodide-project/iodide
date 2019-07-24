import React from "react";
import PropTypes from "prop-types";

export default class HTMLRenderer extends React.Component {
  static propTypes = {
    htmlString: PropTypes.string.isRequired
  };

  render() {
    return (
      <div
        title="htmlRep"
        dangerouslySetInnerHTML={{ __html: this.props.htmlString }} // eslint-disable-line react/no-danger
      />
    );
  }
}
