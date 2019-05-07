import React from "react";
// import styled from "react-emotion";
import PropTypes from "prop-types";
import MediumRep from "./medium-rep";

export class ExpandableRep extends React.Component {
  static propTypes = {
    path: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    pathType: PropTypes.oneOf,
    getSerializedObjAtPath: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  toggleExpand() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const serializedObj = this.props.serializeMed(this.props.path);

    const subpathSummary = this.state.expanded ? "" : <SubpathSummary

    return (
      <React.Fragment>
        <div onClick={this.toggleExpand}>
          <ExpanderArrow expanded={this.state.expanded}>
          {<MediumRep />}{subpathSummary}
          {subpathsExpanded}
        </div>
      </React.Fragment>
    );
  }
}

export default class RepManager extends React.PureComponent {
  static propTypes = {
    path: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    getSerializedObjAtPath: PropTypes.func.isRequired
  };

  render() {
    const { getSerializedObjAtPath, path } = this.props;
    const serializedObj = this.props.serializeMed(this.props.path);
    return serializedObj.subpaths ? (
      <ExpandableRep {...{ getSerializedObjAtPath, path }} />
    ) : (
      <LeafRep />
    );
  }
}
