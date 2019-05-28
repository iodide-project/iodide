import React from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import InlineChildSummary from "./in-line-child-summary";

import {
  ValueSummary,
  RangeDescriptor
} from "./rep-utils/rep-serialization-core-types";

import ValueSummaryRep from "./value-summary";
import { PathLabelRep } from "./path-label-rep";

export const ChildSummariesContainer = styled("div")`
  border-left: 1px solid #ccc;
  margin-left: 10px;
  padding-left: 5px;
`;

export const LabelAndSummaryContainer = styled("div")`
  display: flex;
  justify-content: left;
`;

export const ExpanderDiv = styled("div")`
  min-width: 15px;
  padding-left: 5px;
`;

const Expander = ({ expansion }) =>
  ({
    EXPANDED: <ExpanderDiv>▾</ExpanderDiv>,
    COLLAPSED: <ExpanderDiv>▸</ExpanderDiv>,
    NONE: <ExpanderDiv> </ExpanderDiv>
  }[expansion]);
Expander.propTypes = {
  expansion: PropTypes.oneOf(["EXPANDED", "COLLAPSED", "NONE"])
};

export class LeafNodeRep extends React.Component {
  static propTypes = {
    pathLabel: PropTypes.string.isRequired,
    valueSummary: PropTypes.instanceOf(ValueSummary).isRequired
  };
  render() {
    return (
      <LabelAndSummaryContainer>
        <Expander expansion="NONE" />
        <PathLabelRep pathLabel={this.props.pathLabel} />
        <ValueSummaryRep {...this.props.valueSummary} />
      </LabelAndSummaryContainer>
    );
  }
}

export default class ExpandableRep extends React.Component {
  static propTypes = {
    pathToEntity: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(RangeDescriptor)
      ])
    ).isRequired,
    valueSummary: PropTypes.instanceOf(ValueSummary),
    getChildSummaries: PropTypes.func.isRequired,
    rootObjName: PropTypes.string,
    pathLabel: PropTypes.string
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
      rootObjName,
      pathLabel
    } = this.props;
    const { expanded, childSummaries, compactChildSummaries } = this.state;

    // const valueSummaryRep =
    //   valueSummary !== null ? <ValueSummaryRep {...valueSummary} /> : "";

    const childItems = expanded ? (
      <ChildSummariesContainer>
        {childSummaries.childItems.map(({ path, summary }) => {
          if (summary instanceof ValueSummary && summary.size === 0) {
            return <LeafNodeRep valueSummary={summary} pathLabel={path} />;
          }
          return (
            <ExpandableRep
              key={JSON.stringify(path)}
              pathLabel={path}
              valueSummary={summary}
              pathToEntity={[...pathToEntity, path]}
              getChildSummaries={getChildSummaries}
              rootObjName={rootObjName}
            />
          );
        })}
      </ChildSummariesContainer>
    ) : (
      ""
    );

    return (
      <div>
        <LabelAndSummaryContainer onClick={this.toggleExpand}>
          {pathLabel && (
            <Expander expansion={expanded ? "EXPANDED" : "COLLAPSED"} />
          )}
          <div>
            {pathLabel && <PathLabelRep pathLabel={pathLabel} />}
            {valueSummary && <ValueSummaryRep {...valueSummary} />}
            {!expanded && <InlineChildSummary {...compactChildSummaries} />}
          </div>
        </LabelAndSummaryContainer>
        {childItems}
      </div>
    );
  }
}
