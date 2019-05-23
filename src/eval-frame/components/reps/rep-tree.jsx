import React from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import InlineChildSummary from "./in-line-child-summary";

import {
  ValueSummary,
  RangeDescriptor
} from "./rep-utils/rep-serialization-core-types";

import ValueSummaryRep, { RepBaseText } from "./value-summary";

export const SubPathsContainer = styled("div")`
  border-left: 1px solid red;
  margin-left: 5px;
`;

const ExpanderArrow = ({ expanded }) => (expanded ? "▾" : "▸");
ExpanderArrow.propTypes = {
  expanded: PropTypes.bool.isRequired
};

export class ExpandablePathLabelRep extends React.Component {
  static propTypes = {
    pathLabel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(RangeDescriptor)
    ]),
    expansion: PropTypes.oneOf(["EXPANDED", "COLLAPSED", "ATOMIC"])
  };
  render() {
    if (!this.props.pathLabel) {
      return "";
    }

    let expansionChar = " ";
    if (this.props.expansion === "EXPANDED") {
      expansionChar = "▾";
    } else if (this.props.expansion === "COLLAPSED") {
      expansionChar = "▸";
    }

    if (typeof this.props.pathLabel === "string") {
      return (
        <RepBaseText>
          {expansionChar} {this.props.pathLabel}:{" "}
        </RepBaseText>
      );
    }
    const { min, max } = this.props.pathLabel;
    return (
      <RepBaseText>
        {expansionChar} {`[${min}⋯${max}]`}
      </RepBaseText>
    );
  }
}

// const objSummaryShape = PropTypes.shape({
//   objType: PropTypes.string.isRequired,
//   objClass: PropTypes.string.isRequired,
//   size: PropTypes.number,
//   stringValue: PropTypes.string.isRequired,
//   isTruncated: PropTypes.bool.isRequired
// });

export default class ExpandableRep extends React.Component {
  static propTypes = {
    pathToEntity: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(RangeDescriptor)
      ])
    ).isRequired,
    valueSummary: PropTypes.instanceOf(ValueSummary),
    getChildSummaries: PropTypes.func,
    rootObjName: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.toggleExpand = this.toggleExpand.bind(this);
  }
  state = {
    childSummaries: null,
    compactChildSummaries: null,
    expanded: false
  };

  async componentDidMount() {
    // on mount, get the array of childSummaries for this entity
    // in compact form. this array of {path, summary} objs
    // can be used for in-line summaries where applicable.
    const { rootObjName, pathToEntity } = this.props;
    const compactChildSummaries = await this.props.getChildSummaries(
      rootObjName,
      pathToEntity
    );

    // this following lint rule is controversial. the react docs *advise*
    // loading data in compDidMount, and explicitly say calling
    // setState is ok if needed. Disabling lint rule is justified.
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ compactChildSummaries });
  }

  async toggleExpand() {
    // on toggleExpand, update the childSummaries in the
    // compact/non-compact form as needed
    const { rootObjName, pathToEntity } = this.props;
    const childSummaries = await this.props.getChildSummaries(
      rootObjName,
      pathToEntity,
      !this.state.expanded
    );
    this.setState({ expanded: !this.state.expanded, childSummaries });
  }

  render() {
    const {
      pathToEntity,
      valueSummary,
      getChildSummaries,
      rootObjName
    } = this.props;
    const { expanded, childSummaries, compactChildSummaries } = this.state;

    // pathLabel is only needed if the we already *within* a nested obj,
    // ie, only if the path to this entity is > 1 item long
    const pathLabel =
      pathToEntity.length > 1 ? pathToEntity[pathToEntity.length - 1] : null;

    // leaf node: no child childItems
    if (valueSummary !== null && valueSummary.size === 0) {
      return (
        <div>
          <ExpandablePathLabelRep pathLabel={pathLabel} expansion="ATOMIC" />
          {"  "}
          <ValueSummaryRep {...valueSummary} />
        </div>
      );
    }

    //
    if (pathLabel instanceof RangeDescriptor) {
    }

    // const expanderArrow = <ExpanderArrow {...{ expanded }} />;

    console.log("pathToEntity", this.props.pathToEntity);
    console.log("valueSummary", this.props.valueSummary);
    const valueSummaryRep =
      valueSummary !== null ? <ValueSummaryRep {...valueSummary} /> : "";

    const childItems = expanded ? (
      <SubPathsContainer>
        {childSummaries.childItems.map(({ path, summary }) => {
          return (
            <React.Fragment key={JSON.stringify(path)}>
              <ExpandableRep
                valueSummary={summary}
                pathToEntity={[...pathToEntity, path]}
                getChildSummaries={getChildSummaries}
                rootObjName={rootObjName}
              />
            </React.Fragment>
          );
        })}
      </SubPathsContainer>
    ) : (
      ""
    );

    return (
      <div>
        <div onClick={this.toggleExpand}>
          {/* {expanderArrow} */}
          {"  "}
          <ExpandablePathLabelRep
            pathLabel={pathLabel}
            expansion={expanded ? "EXPANDED" : "COLLAPSED"}
          />
          {valueSummaryRep}
          <InlineChildSummary {...compactChildSummaries} />
        </div>
        {childItems}
      </div>
    );
  }
}
