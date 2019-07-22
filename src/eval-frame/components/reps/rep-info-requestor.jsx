import React from "react";
import PropTypes from "prop-types";

import { requestRepInfo } from "./request-rep-info";

export default class RepInfoRequestor extends React.Component {
  static propTypes = {
    requestRepInfo: PropTypes.func,
    placeholderComponent: PropTypes.node,
    wrappedComponent: PropTypes.element
  };

  static defaultProps = { requestRepInfo };

  constructor(props) {
    super(props);
    this.state = { repRequestInfo: null };
  }
  async componentDidMount() {
    const { rootObjName, pathToEntity } = this.state;
    const repRequestInfo = await this.props.getTopLevelRepSummary(
      rootObjName,
      pathToEntity
    );
    // this following lint rule is controversial. the react docs *advise*
    // loading data in compDidMount, and explicitly say calling
    // setState is ok if needed. Disabling lint rule is justified.
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ topLevelRepSummary });
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { repRequestInfo } = this.state;

    if (repRequestInfo === null) {
      return this.props.placeholderComponent || "";
    }
  }
}
