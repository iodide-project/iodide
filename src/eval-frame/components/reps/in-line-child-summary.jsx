import React from "react";
// import styled from "react-emotion";
import PropTypes from "prop-types";

import ValueSummary, { RepBaseText, Ell } from "./value-summary";

import { PathLabelRep } from "./path-label-rep";

import {
  ChildSummaryItem,
  RangeDescriptor,
  MapPairSummaryItem,
  ChildSummary
} from "./rep-utils/rep-serialization-core-types";

import {
  numericIndexTypes
  // objectLikeTypes
} from "./rep-utils/child-summary-serializer";

function truncateChildItemsForInlineSummary(childItems, maxToShow = 5) {
  const inlineChildItems = childItems.slice(0, maxToShow);
  if (childItems.length > maxToShow) {
    // need to add a RangeDescriptor in this case;
    // if the last subpath is a RangeDescriptor,
    // the added RangeDescriptor must account for that
    const lastItem = childItems[childItems.length - 1];
    const max =
      lastItem.path instanceof RangeDescriptor
        ? lastItem.path.max
        : childItems.length;

    inlineChildItems.push(
      new ChildSummaryItem(
        new RangeDescriptor(maxToShow + 1, max, "INLINE_SUMMARY_RANGE"),
        null
      )
    );
  }
  return inlineChildItems;
}

const TinyRangeRep = ({ number }) => <Ell>⋯{number} more⋯</Ell>;
TinyRangeRep.propTypes = {
  number: PropTypes.number.isRequired
};

const InlineKeyValSummaryItem = ({ summaryItem, mappingDelim }) => {
  const { path, summary } = summaryItem;
  return (
    <React.Fragment key={JSON.stringify(summaryItem.path)}>
      <PathLabelRep pathLabel={path} tiny {...{ mappingDelim }} />
      <ValueSummary tiny {...summary} />
    </React.Fragment>
  );
};
InlineKeyValSummaryItem.propTypes = {
  summaryItem: PropTypes.instanceOf(ChildSummaryItem),
  mappingDelim: PropTypes.string
};

const MapKeyValSummaryItem = ({ summaryItem }) => {
  const { keySummary, valSummary, path } = summaryItem;

  return (
    <React.Fragment key={JSON.stringify(path)}>
      <ValueSummary tiny {...keySummary} />
      {" → "}
      <ValueSummary tiny {...valSummary} />
    </React.Fragment>
  );
};
MapKeyValSummaryItem.propTypes = {
  summaryItem: PropTypes.instanceOf(MapPairSummaryItem)
};

const UnlabeledSummaryItem = ({ summaryItem }) => {
  return <ValueSummary tiny {...summaryItem.summary} />;
};
UnlabeledSummaryItem.propTypes = {
  summaryItem: PropTypes.instanceOf(ChildSummaryItem)
};

const SummaryItemWithRangeHandling = (summaryItem, summaryItemRep) => {
  const { path } = summaryItem;
  if (path instanceof RangeDescriptor) {
    return <TinyRangeRep number={path.max - path.min + 1} />;
  }
  return summaryItemRep({ summaryItem });
};
SummaryItemWithRangeHandling.propTypes = {
  summaryItem: PropTypes.instanceOf(ChildSummaryItem),
  summaryItemRep: PropTypes.func.isRequired
};

export const InlineChildSummary = ({ childSummaries, parentType }) => {
  if (!childSummaries || !parentType || parentType === "String") return "";

  const { childItems } = childSummaries;

  let summaryItemRep = InlineKeyValSummaryItem;
  let openBracket = "{";
  let closeBracket = "}";
  let truncateChildList = true;

  if (numericIndexTypes.includes(parentType)) {
    summaryItemRep = UnlabeledSummaryItem;
    openBracket = "[";
    closeBracket = "]";
    // for arrays, we want the head/tail preview
    // generated upstream
    truncateChildList = false;
  } else if (parentType === "Set") {
    summaryItemRep = UnlabeledSummaryItem;
  } else if (parentType === "Map") {
    summaryItemRep = MapKeyValSummaryItem;
  }

  const finalChildItems = truncateChildList
    ? truncateChildItemsForInlineSummary(childItems)
    : childItems;

  if (finalChildItems.length === 0) {
    return (
      <RepBaseText>
        {openBracket}
        {closeBracket}
      </RepBaseText>
    );
  }

  return (
    <RepBaseText>
      {openBracket}
      {SummaryItemWithRangeHandling(finalChildItems[0], summaryItemRep)}
      {finalChildItems.slice(1).map(summaryItem => (
        <React.Fragment key={JSON.stringify(summaryItem.path)}>
          , {SummaryItemWithRangeHandling(summaryItem, summaryItemRep)}
        </React.Fragment>
      ))}
      {closeBracket}
    </RepBaseText>
  );
};
InlineChildSummary.propTypes = {
  childSummaries: PropTypes.instanceOf(ChildSummary),
  parentType: PropTypes.string
};

export default InlineChildSummary;
