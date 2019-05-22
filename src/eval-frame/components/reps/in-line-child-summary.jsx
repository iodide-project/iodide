import React from "react";
// import styled from "react-emotion";
import PropTypes from "prop-types";

import ValueSummary, {
  // labelRepForType,
  // typeToValueSummary tinyMapping,
  RepBaseText,
  Ell
} from "./value-summary";

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

const InlineListSummaryItem = ({ path, summary }) => {
  if (summary === null) {
    return <TinyRangeRep number={path.max - path.min + 1} />;
  }
  return <ValueSummary tiny {...summary} />;
};
InlineListSummaryItem.propTypes = {
  summary: PropTypes.object, //eslint-disable-line
  path: PropTypes.string
};

const MediumListSummary = ({
  childItems,
  openBracket = "[",
  closeBracket = "]"
}) => {
  if (childItems.length > 0) {
    return (
      <DelimitedList {...{ openBracket, closeBracket }}>
        {childItems.map(({ path, summary }) => (
          <InlineListSummaryItem
            key={JSON.stringify(path)}
            {...{ path, summary }}
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

const InlineKeyValSummaryItem = ({ path, summary, mappingDelim }) => {
  if (summary === null) {
    return <TinyRangeRep number={path.max - path.min + 1} />;
  }
  return (
    <React.Fragment>
      {path}
      {mappingDelim}
      <ValueSummary tiny {...summary} />
    </React.Fragment>
  );
};
InlineKeyValSummaryItem.propTypes = {
  summary: PropTypes.object, //eslint-disable-line
  path: PropTypes.string,
  mappingDelim: PropTypes.string
};

const InlineKeyValSummary = ({
  childItems,
  mappingDelim = ": ",
  childItemsToShow = 5
}) => {
  const inlineSubpaths = childItems.slice(0, childItemsToShow);
  if (childItems.length > childItemsToShow) {
    // need to add a RangeDescriptor in this case;
    // if the last subpath is a RangeDescriptor,
    // the added RangeDescriptor must account for that

    const lastPath = childItems[childItems.length - 1];
    const max =
      lastPath.path.max !== undefined ? lastPath.path.max : childItems.length;

    inlineSubpaths.push({
      path: { min: childItemsToShow + 1, max },
      summary: null
    });
  }

  return (
    <DelimitedList>
      {inlineSubpaths.map(({ path, summary }) => (
        <InlineKeyValSummaryItem {...{ path, summary, mappingDelim }} />
      ))}
    </DelimitedList>
  );
};
InlineKeyValSummary.propTypes = {
  childItems: PropTypes.arrayOf(PropTypes.object),
  mappingDelim: PropTypes.string,
  childItemsToShow: PropTypes.number
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
