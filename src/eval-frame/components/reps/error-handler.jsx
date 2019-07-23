import React from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";

const ErrorPrintout = styled("div")`
  pre {
    margin: 0;
  }
`;

export default class ErrorRenderer extends React.Component {
  static propTypes = {
    errorString: PropTypes.string.isRequired
  };

  render() {
    return (
      <ErrorPrintout>
        <pre>{this.props.errorString}</pre>
      </ErrorPrintout>
    );
  }
}
