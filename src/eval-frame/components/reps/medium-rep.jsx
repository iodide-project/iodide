import React from "react";
// import styled from "react-emotion";
import PropTypes from "prop-types";

import TinyRep, {
  labelRepForType,
  // typeToTinyRepMapping,
  RepBaseText
} from "./tiny-rep";

// export class MediumSubpathSummary extends React.PureComponent {
//   static propTypes = {
//     arrayOfObjects: PropTypes.arrayOf(
//       PropTypes.shape({
//         label: PropTypes.string.isRequired,
//         serializedObj: PropTypes.shape({
//           objClass: PropTypes.string.isRequired,
//           objType: PropTypes.string.isRequired,
//           size: PropTypes.number,
//           stringValue: PropTypes.string.isRequired,
//           isTruncated: PropTypes.bool.isRequired
//         })
//       })
//     )
//   };
//   render() {
//     const { objType } = this.props;
//     const repType = repMappingHandledTypes.includes(objType)
//       ? objType
//       : "Object";
//     return labelRepForType(this.props.serializedObj, objType);
//   }
// }

// const ClassInfoText = styled(RepBaseText)`
//   color: ${classInfoColor};
// `;

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

const MediumListSummary = ({
  subpathSummaries,
  openBracket = "[",
  closeBracket = "]"
}) => {
  if (subpathSummaries.length > 0) {
    return (
      <DelimitedList {...{ openBracket, closeBracket }}>
        {subpathSummaries.map((obj, i) => (
          <TinyRep {...obj} key={i} />
        ))}
      </DelimitedList>
    );
  }
  return <RepBaseText>[]</RepBaseText>;
};
MediumListSummary.propTypes = {
  subpathSummaries: PropTypes.arrayOf(PropTypes.object),
  openBracket: PropTypes.string,
  closeBracket: PropTypes.string
};

const MediumKeyValSummary = ({ subpathSummaries, mappingDelim = ": " }) => {
  // if (subpathSummaries.length > 0) {
  return (
    <DelimitedList>
      {subpathSummaries.map((obj, i) =>
        obj.objType === "REPS_META_MORE" ? (
          <TinyRep {...obj} key={`more-${i}`} />
        ) : (
          <React.Fragment key={`key-val-${i}`}>
            <TinyRep {...obj.key} />
            {mappingDelim}
            <TinyRep {...obj.value} />
          </React.Fragment>
        )
      )}
    </DelimitedList>
  );
  // }
  // return <RepBaseText>[]</RepBaseText>;
};
MediumKeyValSummary.propTypes = {
  subpathSummaries: PropTypes.arrayOf(PropTypes.object),
  mappingDelim: PropTypes.string
};

/* eslint-enable react/no-array-index-key */

const MediumSummary = ({ subpathSummaries, subpathSummaryType }) => {
  switch (subpathSummaryType) {
    case "ARRAY_PATH_SUMMARY":
      return <MediumListSummary {...{ subpathSummaries }} />;
    case "SET_PATH_SUMMARY":
      return (
        <MediumListSummary
          openBracket="{"
          closeBracket="}"
          {...{ subpathSummaries }}
        />
      );
    case "OBJECT_PATH_SUMMARY":
      return <MediumKeyValSummary {...{ subpathSummaries }} />;
    case "MAP_PATH_SUMMARY":
      return (
        <MediumKeyValSummary mappingDelim=" → " {...{ subpathSummaries }} />
      );

    default:
      return "";
  }
};

export default class MediumRep extends React.PureComponent {
  static propTypes = {
    objType: PropTypes.string.isRequired,
    subpathSummaryType: PropTypes.string.isRequired,
    subpathSummaries: PropTypes.arrayOf(PropTypes.object),
    /* eslint-disable react/no-unused-prop-types */
    objClass: PropTypes.string.isRequired,
    size: PropTypes.number,
    stringValue: PropTypes.string.isRequired,
    isTruncated: PropTypes.bool.isRequired
    /* eslint-enable react/no-unused-prop-types */
  };
  render() {
    const { objType } = this.props;
    const { subpathSummaries, subpathSummaryType } = this.props;
    return (
      <React.Fragment>
        {labelRepForType(this.props, objType)}
        <MediumSummary {...{ subpathSummaries, subpathSummaryType }} />
      </React.Fragment>
    );
  }
}
