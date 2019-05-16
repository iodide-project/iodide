import React from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import { MediumSummary } from "./in-line-child-summary";
import ValueSummary from "./value-summary";

export const SubPathsContainer = styled("div")`
  border-left: 1px solid red;
  margin-left: 5px;
`;

const ExpanderArrow = ({ expanded }) => (expanded ? "-" : "+");
// RepsMetaMore.propTypes = {
//   number: PropTypes.number.isRequired
// };

export class PathIdentifierRep extends React.Component {
  /* this handles: 
  - REPS_META_PROP_LABEL, REPS_META_PROP_STRING_LABEL (need to refactor)
  - index ranges, including splitting ranges and returning a Fragment with subranges
  - displaying integer indices correctl
  */
}

const objSummaryShape = PropTypes.shape({
  objType: PropTypes.string.isRequired,
  objClass: PropTypes.string.isRequired,
  size: PropTypes.number,
  stringValue: PropTypes.string.isRequired,
  isTruncated: PropTypes.bool.isRequired
});

// const childrenSummaryShape = PropTypes.arrayOf(
//   PropTypes.shape({
//     key: PropTypes.string.isRequired,
//     value: objSummaryShape
//   })
// );

export class ExpandableRep extends React.Component {
  static propTypes = {
    path: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    valueSummary: objSummaryShape,
    // childSummaries: childrenSummaryShape,
    getChildSummaries: PropTypes.func,
    lookUpRoot: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.toggleExpand = this.toggleExpand.bind(this);
  }
  state = {
    /* child summaries is an array of object like:
    { key: <string or rangeObject>, value: objSummaryShape }
      */
    childSummaries: [],
    expanded: false
  };

  async componentDidMount() {
    const { lookUpRoot, path } = this.props;
    const childSummaries = await this.props.getChildSummaries(
      lookUpRoot,
      path,
      "ALL_SUBPATHS"
    );

    // this lint rule is controversial. the react docs *advise*
    // loading data in compDidMount, and explicitly say calling
    // setState is ok if needed
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ childSummaries });
  }

  toggleExpand() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { valueSummary, getChildSummaries, lookUpRoot } = this.props;
    const { expanded, childSummaries } = this.state;

    const subpaths = !expanded ? (
      <SubPathsContainer>
        {childSummaries.map(({ key, value }) => {
          const path = [...this.props.path, key];
          return (
            <React.Fragment>
              <PathIdentifierRep path={key} />
              <ExpandableRep
                valueSummary={value}
                {...{ path, getChildSummaries, lookUpRoot }}
              />
            </React.Fragment>
          );
        })}
      </SubPathsContainer>
    ) : (
      ""
    );

    return (
      <React.Fragment>
        <div onClick={this.toggleExpand}>
          <ExpanderArrow collapsed={expanded} />
          <ValueSummary serializedObj={valueSummary} />
          <MediumSummary {...{ childSummaries }} />
        </div>
        {subpaths}
      </React.Fragment>
    );
  }
}
