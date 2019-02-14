import React from "react";
import PropTypes from "prop-types";

import { Inspector } from "iodide-react-inspector";

export default class DefaultRenderer extends React.Component {
  static propTypes = {
    value: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <pre>{String(this.props.value)}</pre>;
    }
    return <Inspector data={this.props.value} shouldShowPlaceholder={false} />;
  }
}
