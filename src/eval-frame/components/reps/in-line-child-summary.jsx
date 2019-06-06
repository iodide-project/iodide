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

/* eslint-disable react/no-array-index-key */
const DelimitedList = ({
  children,
  delimiter = ", ",
  openBracket = "{",
  closeBracket = "}"
}) => {
  if (children === undefined || children.length === 0) {
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
      {children[0]}
      {children.slice(1).map((obj, i) => (
        <React.Fragment key={i}>
          {delimiter}
          {obj}
        </React.Fragment>
      ))}
      {closeBracket}
    </RepBaseText>
  );
};
DelimitedList.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  delimiter: PropTypes.string,
  openBracket: PropTypes.string,
  closeBracket: PropTypes.string
};
/* eslint-enable react/no-array-index-key */

const TinyRangeRep = ({ number }) => <Ell>⋯{number} more⋯</Ell>;
TinyRangeRep.propTypes = {
  number: PropTypes.number.isRequired
};

const InlineListSummaryItem = ({ summaryItem }) => {
  const { path, summary } = summaryItem;
  if (summary === null) {
    return <TinyRangeRep number={path.max - path.min + 1} />;
  }
  return <ValueSummary tiny {...summary} />;
};
InlineListSummaryItem.propTypes = {
  summaryItem: PropTypes.instanceOf(ChildSummaryItem)
};

const MediumListSummary = ({
  childItems,
  openBracket = "[",
  closeBracket = "]"
}) => (
  <DelimitedList {...{ openBracket, closeBracket }}>
    {childItems.map(summaryItem => (
      <InlineListSummaryItem
        key={JSON.stringify(summaryItem.path)}
        summaryItem={summaryItem}
      />
    ))}
  </DelimitedList>
);
MediumListSummary.propTypes = {
  childItems: PropTypes.arrayOf(PropTypes.object),
  openBracket: PropTypes.string,
  closeBracket: PropTypes.string
};

const InlineKeyValSummaryItem = ({ summaryItem, mappingDelim }) => {
  const { path, summary } = summaryItem;
  if (path instanceof RangeDescriptor) {
    return (
      <TinyRangeRep
        key={JSON.stringify(summaryItem.path)}
        number={path.max - path.min + 1}
      />
    );
  }
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

const InlineKeyValSummary = ({
  childItems,
  mappingDelim = ":",
  summaryItemRep,
  numChildItemsToShow = 5
}) => {
  const inlineSubpaths = childItems.slice(0, numChildItemsToShow);
  if (childItems.length > numChildItemsToShow) {
    // need to add a RangeDescriptor in this case;
    // if the last subpath is a RangeDescriptor,
    // the added RangeDescriptor must account for that
    const lastItem = childItems[childItems.length - 1];
    const max =
      lastItem.path instanceof RangeDescriptor
        ? lastItem.path.max
        : childItems.length;

    inlineSubpaths.push(
      new ChildSummaryItem(
        new RangeDescriptor(
          numChildItemsToShow + 1,
          max,
          "INLINE_SUMMARY_RANGE"
        ),
        null
      )
    );
  }

  return (
    <DelimitedList>
      {inlineSubpaths.map(summaryItem =>
        summaryItemRep({ summaryItem, mappingDelim })
      )}
    </DelimitedList>
  );
};
InlineKeyValSummary.propTypes = {
  childItems: PropTypes.arrayOf(PropTypes.object),
  mappingDelim: PropTypes.string,
  numChildItemsToShow: PropTypes.number,
  summaryItemRep: PropTypes.func.isRequired
};

const MapKeyValSummaryItem = ({ summaryItem }) => {
  const { keySummary, valSummary, path } = summaryItem;

  if (path instanceof RangeDescriptor) {
    return (
      <TinyRangeRep
        key={JSON.stringify(summaryItem.path)}
        number={path.max - path.min + 1}
      />
    );
  }
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

const InlineChildSummary = ({ childSummaries, parentType }) => {
  if (!childSummaries || !parentType) return "";

  const { childItems } = childSummaries;

  if (parentType === "String") return "";

  if (numericIndexTypes.includes(parentType)) {
    return <MediumListSummary childItems={childItems} />;
  } else if (parentType === "Set") {
    return (
      <MediumListSummary
        childItems={childItems}
        openBracket="{"
        closeBracket="}"
      />
    );
  }

  const summaryItemRep =
    parentType === "Map" ? MapKeyValSummaryItem : InlineKeyValSummaryItem;
  return (
    <InlineKeyValSummary
      childItems={childItems}
      summaryItemRep={summaryItemRep}
    />
  );
};
InlineChildSummary.propTypes = {
  childSummaries: PropTypes.instanceOf(ChildSummary),
  parentType: PropTypes.string.isRequired
};

export default InlineChildSummary;
