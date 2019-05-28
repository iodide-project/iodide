import React from "react";
// import styled from "react-emotion";
import PropTypes from "prop-types";

import ValueSummary, {
  // labelRepForType,
  // typeToValueSummary tinyMapping,
  RepBaseText,
  Ell
} from "./value-summary";

import { PathLabelRep } from "./path-label-rep";

import {
  ChildSummaryItem,
  RangeDescriptor
} from "./rep-utils/rep-serialization-core-types";

/* eslint-disable react/no-array-index-key */
const DelimitedList = ({
  children,
  delimiter = ", ",
  openBracket = "{",
  closeBracket = "}"
}) => (
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
DelimitedList.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  delimiter: PropTypes.string,
  openBracket: PropTypes.string,
  closeBracket: PropTypes.string
};

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
}) => {
  if (childItems.length > 0) {
    return (
      <DelimitedList {...{ openBracket, closeBracket }}>
        {childItems.map(summaryItem => (
          <InlineListSummaryItem
            key={JSON.stringify(summaryItem.path)}
            summaryItem={summaryItem}
          />
        ))}
      </DelimitedList>
    );
  }
  return (
    <RepBaseText>
      {openBracket}
      {closeBracket}
    </RepBaseText>
  );
};
MediumListSummary.propTypes = {
  childItems: PropTypes.arrayOf(PropTypes.object),
  openBracket: PropTypes.string,
  closeBracket: PropTypes.string
};

const InlineKeyValSummaryItem = ({ summaryItem, mappingDelim }) => {
  const { path, summary } = summaryItem;
  if (summary === null) {
    return <TinyRangeRep number={path.max - path.min + 1} />;
  }
  return (
    <React.Fragment>
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
  numChildItemsToShow = 5
}) => {
  const inlineSubpaths = childItems.slice(0, numChildItemsToShow);
  if (childItems.length > numChildItemsToShow) {
    // need to add a RangeDescriptor in this case;
    // if the last subpath is a RangeDescriptor,
    // the added RangeDescriptor must account for that

    const lastPath = childItems[childItems.length - 1];
    const max =
      lastPath.path.max !== undefined ? lastPath.path.max : childItems.length;

    inlineSubpaths.push(
      new ChildSummaryItem(
        new RangeDescriptor(numChildItemsToShow + 1, max, "RangeDescriptor"),
        null
      )
    );
  }

  return (
    <DelimitedList>
      {inlineSubpaths.map(summaryItem => (
        <InlineKeyValSummaryItem
          key={JSON.stringify(summaryItem.path)}
          {...{ summaryItem, mappingDelim }}
        />
      ))}
    </DelimitedList>
  );
};
InlineKeyValSummary.propTypes = {
  childItems: PropTypes.arrayOf(PropTypes.object),
  mappingDelim: PropTypes.string,
  numChildItemsToShow: PropTypes.number
};

/* eslint-enable react/no-array-index-key */

const InlineChildSummary = ({ childItems, summaryType }) => {
  switch (summaryType) {
    case "ARRAY_PATH_SUMMARY":
      return <MediumListSummary childItems={childItems} />;
    // case "SET_PATH_SUMMARY":
    //   return (
    //     <MediumListSummary openBracket="{" closeBracket="}" {...{ children }} />
    //   );
    case "OBJECT_PATH_SUMMARY":
      return <InlineKeyValSummary childItems={childItems} />;
    // case "MAP_PATH_SUMMARY":
    //   return <MediumKeyValSummary mappingDelim=" → " {...{ children }} />;

    default:
      return "";
  }
};

export default InlineChildSummary;

// export default class MediumRep extends React.PureComponent {
//   static propTypes = {
//     objType: PropTypes.string.isRequired,
//     subpathSummaryType: PropTypes.string.isRequired,
//     childItems: PropTypes.arrayOf(PropTypes.object),
//     /* eslint-disable react/no-unused-prop-types */
//     objClass: PropTypes.string.isRequired,
//     size: PropTypes.number,
//     stringValue: PropTypes.string.isRequired,
//     isTruncated: PropTypes.bool.isRequired
//     /* eslint-enable react/no-unused-prop-types */
//   };
//   render() {
//     const { objType } = this.props;
//     const { childItems, subpathSummaryType } = this.props;
//     return (
//       <React.Fragment>
//         {labelRepForType(this.props, objType)}
//         <InLineChildSummary {...{ childItems, subpathSummaryType }} />
//       </React.Fragment>
//     );
//   }
// }
