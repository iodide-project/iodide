import React from "react";
import PropTypes from "prop-types";

import { Inspector } from "react-inspector";

export default class DefaultRenderer extends React.Component {
  static propTypes = {
    value: PropTypes.any.isRequired
  };

  render() {
    return <Inspector data={this.props.value} shouldShowPlaceholder={false} />;
  }
}
