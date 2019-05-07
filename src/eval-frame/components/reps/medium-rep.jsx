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
const MediumArraySummary = ({ subpathSummaries }) => {
  console.log("MediumArraySummary", subpathSummaries);
  if (subpathSummaries.length > 0) {
    return (
      <RepBaseText>
        {"["}
        <TinyRep serializedObj={subpathSummaries[0]} />
        {subpathSummaries.slice(1).map(obj => (
          <React.Fragment>
            {", "}
            <TinyRep serializedObj={obj} />
          </React.Fragment>
        ))}
        {"]"}
      </RepBaseText>
    );
  }
  return <RepBaseText>[]</RepBaseText>;
};
MediumArraySummary.propTypes = {
  subpathSummaries: PropTypes.arrayOf(PropTypes.object)
};

const MediumSummary = ({ subpathSummaries, subpathSummaryType }) => {
  console.log(
    "MediumSummary subpathSummaries",
    subpathSummaries,
    subpathSummaryType
  );
  switch (subpathSummaryType) {
    case "ARRAY_PATH_SUMMARY":
      return <MediumArraySummary {...{ subpathSummaries }} />;
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
