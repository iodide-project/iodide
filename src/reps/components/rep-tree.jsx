import React from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import InlineChildSummary from "./in-line-child-summary";

import {
  isValueSummary,
  isSubstringRangeSummaryItem,
  isMapPairSummaryItem
} from "../shared/rep-serialization-core-types";

import {
  ValueSummaryPropTypes,
  PathLabelPropTypes,
  PathToEntityPropTypes
} from "./rep-serialization-core-types-proptypes";

import ValueSummaryRep from "./value-summary";
import { PathLabelRep } from "./path-label-rep";

export const ChildSummariesContainer = styled("div")`
  border-left: 1px solid #ccc;
  margin-left: 9px;
  padding-left: 7px;
`;

export const LabelAndSummaryContainer = styled("div")`
  display: flex;
  justify-content: left;
`;

export const ClickableLabelAndSummaryContainer = styled(
  LabelAndSummaryContainer
)`
  cursor: pointer;
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
    valueSummary: ValueSummaryPropTypes.isRequired
  };
  render() {
    return (
      <LabelAndSummaryContainer>
        <Expander expansion="NONE" />
        <div>
          <PathLabelRep pathLabel={this.props.pathLabel} />
          <ValueSummaryRep {...this.props.valueSummary} />
        </div>
      </LabelAndSummaryContainer>
    );
  }
}

export default class ExpandableRep extends React.PureComponent {
  static propTypes = {
    pathToEntity: PathToEntityPropTypes.isRequired,
    valueSummary: ValueSummaryPropTypes,
    getChildSummaries: PropTypes.func.isRequired,

    pathLabel: PathLabelPropTypes
  };

  constructor(props) {
    super(props);
    this.toggleExpand = this.toggleExpand.bind(this);
  }
  state = {
    childSummaries: null,
    expanded: false,
    error: null,
    errorInfo: null
  };

  async componentDidMount() {
    // on mount, get the array of childSummaries for this entity
    const { pathToEntity } = this.props;
    const childSummaries = await this.props.getChildSummaries(pathToEntity);

    // this following lint rule is controversial. the react docs *advise*
    // loading data in compDidMount, and explicitly say calling
    // setState is ok if needed. Disabling lint rule is justified.
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ childSummaries });
  }

  async componentDidUpdate(prevProps) {
    // we always want to reset state if we get new props;
    // each value should get a fresh collapsed render
    if (this.props !== prevProps) {
      const { pathToEntity } = this.props;

      const childSummaries = await this.props.getChildSummaries(pathToEntity);
      // react docs say it's ok to setstate if you do so within a conditional.
      // In our case, we always reset the state on any change to props
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ childSummaries, expanded: false });
    }
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo
    });
  }

  async toggleExpand() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    if (this.state.error) {
      return (
        <pre>
          ExpandableRep render failed. errorInfo:
          {JSON.stringify(this.state.errorInfo)}
        </pre>
      );
    }
    const {
      pathToEntity,
      valueSummary,
      getChildSummaries,
      pathLabel
    } = this.props;
    const { expanded, childSummaries } = this.state;

    let expanderState;
    if (isValueSummary(valueSummary) && !valueSummary.isExpandable) {
      expanderState = "NONE";
    } else {
      expanderState = expanded ? "EXPANDED" : "COLLAPSED";
    }

    const childItems = expanded ? (
      <ChildSummariesContainer>
        {childSummaries.childItems.map(summaryItem => {
          const { path, summary } = summaryItem;

          if (isSubstringRangeSummaryItem(summaryItem)) {
            return <ValueSummaryRep key={JSON.stringify(path)} {...summary} />;
          }

          if (isValueSummary(summary) && !summary.isExpandable) {
            return (
              <LeafNodeRep
                key={JSON.stringify(path)}
                valueSummary={summary}
                pathLabel={path}
              />
            );
          }

          if (isMapPairSummaryItem(summaryItem)) {
            return (
              <MapPairFullRep
                key={JSON.stringify(path)}
                pathLabel={path}
                {...summaryItem}
                pathToMapPair={[...pathToEntity, path]}
                getChildSummaries={getChildSummaries}
              />
            );
          }

          return (
            <ExpandableRep
              key={JSON.stringify(path)}
              pathLabel={path}
              valueSummary={summary}
              pathToEntity={[...pathToEntity, path]}
              getChildSummaries={getChildSummaries}
            />
          );
        })}
      </ChildSummariesContainer>
    ) : (
      ""
    );

    return (
      <div>
        <ClickableLabelAndSummaryContainer onClick={this.toggleExpand}>
          <Expander expansion={expanderState} />
          <div>
            {pathLabel && <PathLabelRep pathLabel={pathLabel} />}
            {valueSummary && <ValueSummaryRep {...valueSummary} />}
            {!expanded && valueSummary && valueSummary.isExpandable && (
              <InlineChildSummary
                childSummaries={childSummaries}
                parentType={valueSummary && valueSummary.objType}
              />
            )}
          </div>
        </ClickableLabelAndSummaryContainer>
        {childItems}
      </div>
    );
  }
}

export class MapPairFullRep extends React.Component {
  static propTypes = {
    keySummary: ValueSummaryPropTypes,
    valSummary: ValueSummaryPropTypes,
    pathToMapPair: PathToEntityPropTypes.isRequired,
    getChildSummaries: PropTypes.func.isRequired,
    pathLabel: PathLabelPropTypes
  };
  render() {
    const {
      pathToMapPair,
      keySummary,
      valSummary,
      getChildSummaries,
      pathLabel
    } = this.props;
    return (
      <LabelAndSummaryContainer>
        <div>
          <PathLabelRep pathLabel={pathLabel} />
        </div>
        <div>
          <ExpandableRep
            key={`${JSON.stringify(pathLabel)}-key`}
            pathLabel="key"
            valueSummary={keySummary}
            pathToEntity={[...pathToMapPair, "MAP_KEY"]}
            getChildSummaries={getChildSummaries}
          />
          <ExpandableRep
            key={`${JSON.stringify(pathLabel)}-value`}
            pathLabel="value"
            valueSummary={valSummary}
            pathToEntity={[...pathToMapPair, "MAP_VAL"]}
            getChildSummaries={getChildSummaries}
          />
        </div>
      </LabelAndSummaryContainer>
    );
  }
}
