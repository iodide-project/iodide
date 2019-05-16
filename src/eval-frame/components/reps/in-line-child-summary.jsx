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
  if (path === null) {
    return <TinyRangeRep number={summary.max - summary.min + 1} />;
  }
  return <ValueSummary tiny {...summary} />;
};
InlineListSummaryItem.propTypes = {
  summary: PropTypes.object, //eslint-disable-line
  path: PropTypes.string
};

const MediumListSummary = ({
  subpaths,
  openBracket = "[",
  closeBracket = "]"
}) => {
  if (subpaths.length > 0) {
    return (
      <DelimitedList {...{ openBracket, closeBracket }}>
        {subpaths.map(({ path, summary }) => (
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
  subpaths: PropTypes.arrayOf(PropTypes.object),
  openBracket: PropTypes.string,
  closeBracket: PropTypes.string
};

const InlineKeyValSummaryItem = ({ path, summary, mappingDelim }) => {
  if (path === null) {
    return <TinyRangeRep number={summary.max - summary.min + 1} />;
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
  subpaths,
  mappingDelim = ": ",
  subpathsToShow = 5
}) => {
  const inlineSubpaths = subpaths.slice(0, subpathsToShow);
  if (subpaths.length > subpathsToShow) {
    // need to add a rangeDescriptor in this case;
    // if the last subpath is a rangeDescriptor,
    // the added rangeDescriptor must account for that

    const lastPath = subpaths[subpaths.length - 1];
    const max =
      lastPath.summary.max !== undefined
        ? lastPath.summary.max
        : subpaths.length;

    inlineSubpaths.push({
      path: null,
      summary: { min: subpathsToShow + 1, max }
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
  subpaths: PropTypes.arrayOf(PropTypes.object),
  mappingDelim: PropTypes.string,
  subpathsToShow: PropTypes.number
};

/* eslint-enable react/no-array-index-key */

const InlineChildSummary = ({ subpaths, summaryType }) => {
  switch (summaryType) {
    case "ARRAY_PATH_SUMMARY":
      return <MediumListSummary subpaths={subpaths} />;
    // case "SET_PATH_SUMMARY":
    //   return (
    //     <MediumListSummary openBracket="{" closeBracket="}" {...{ children }} />
    //   );
    case "OBJECT_PATH_SUMMARY":
      return <InlineKeyValSummary subpaths={subpaths} />;
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
//     subpaths: PropTypes.arrayOf(PropTypes.object),
//     /* eslint-disable react/no-unused-prop-types */
//     objClass: PropTypes.string.isRequired,
//     size: PropTypes.number,
//     stringValue: PropTypes.string.isRequired,
//     isTruncated: PropTypes.bool.isRequired
//     /* eslint-enable react/no-unused-prop-types */
//   };
//   render() {
//     const { objType } = this.props;
//     const { subpaths, subpathSummaryType } = this.props;
//     return (
//       <React.Fragment>
//         {labelRepForType(this.props, objType)}
//         <InLineChildSummary {...{ subpaths, subpathSummaryType }} />
//       </React.Fragment>
//     );
//   }
// }
