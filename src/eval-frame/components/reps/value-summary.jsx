import React from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";

import { truncateString } from "./rep-utils/truncate-string";

const numberColor = "rgb(28, 0, 207)";
const boolColor = numberColor;
const nullUndefinedColor = "#808080";
const classInfoColor = "#808080";
const stringColor = "rgb(196, 26, 22)";
const separatorColor = "black";
const dateColor = stringColor;
const symbolColor = stringColor;
const errorColor = "";
const functionColor = "rgb(28, 30, 207)";
const ellipsisColor = "#111 ";
const propLabelColor = "#111 ";

export const RepBaseText = styled("span")`
  font-family: Menlo, monospace;
  font-size: 12px;
  line-height: 14px;
  cursor: pointer;
`;

const stringValueWithColor = color => {
  const RepValueText = styled(RepBaseText)`
    color: ${color};
  `;
  return x => <RepValueText>{x.stringValue}</RepValueText>;
};

const ClassInfoText = styled(RepBaseText)`
  color: ${classInfoColor};
`;

//
export const Ell = styled(RepBaseText)`
  color: ${ellipsisColor};
  background: #e7e7e7;
  border-radius: 3px;
  display: inline-block;
`;
const Ellipsis = () => <Ell>⋯</Ell>;

const Sep = styled(RepBaseText)`
  color: ${separatorColor};
`;

const Truncator = ({ string, isTruncated }) => (
  <React.Fragment>
    {string}
    {isTruncated ? <Ellipsis /> : ""}
  </React.Fragment>
);
Truncator.propTypes = {
  string: PropTypes.string.isRequired,
  isTruncated: PropTypes.bool.isRequired
};

// reps

const ObjectRep = ({ stringValue, size, isTruncated }) => (
  <ClassInfoText>
    <Truncator string={stringValue} {...{ isTruncated }} />({size})
  </ClassInfoText>
);
ObjectRep.propTypes = {
  stringValue: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  isTruncated: PropTypes.bool.isRequired
};

const createQuotedStringRep = (lQuote, rQuote, color = stringColor) => {
  const StringText = styled(RepBaseText)`
    color: ${color};
    overflow-wrap: anywhere;
  `;
  const InnerQuotedStringRep = ({ size, stringValue, isTruncated }) => (
    <span>
      <Sep>{lQuote}</Sep>
      <StringText>
        <Truncator string={stringValue} {...{ isTruncated }} />
      </StringText>
      <Sep>{rQuote}</Sep>
      {isTruncated ? <ClassInfoText>({size})</ClassInfoText> : ""}
    </span>
  );
  InnerQuotedStringRep.propTypes = {
    size: PropTypes.number,
    stringValue: PropTypes.string.isRequired,
    isTruncated: PropTypes.bool.isRequired
  };
  return InnerQuotedStringRep;
};

const StringRep = createQuotedStringRep('"', '"');
const RegexRep = createQuotedStringRep("/", "/");

const SymbolText = styled(RepBaseText)`
  color: ${symbolColor};
`;
const SymbolRep = ({ stringValue, isTruncated }) => (
  <span>
    <SymbolText>
      <Truncator string={stringValue} {...{ isTruncated }} />
      {isTruncated ? ")" : ""}
    </SymbolText>
  </span>
);
SymbolRep.propTypes = {
  stringValue: PropTypes.string.isRequired,
  isTruncated: PropTypes.bool.isRequired
};

const FunctionText = styled(RepBaseText)`
  color: ${functionColor};
  font-style: italic;
`;
const FunctionRep = ({ stringValue, isTruncated }) => (
  <span>
    <FunctionText>
      <Truncator string={stringValue} {...{ isTruncated }} />
      ()
    </FunctionText>
  </span>
);
FunctionRep.propTypes = {
  stringValue: PropTypes.string.isRequired,
  isTruncated: PropTypes.bool.isRequired
};

const ErrorText = styled(RepBaseText)`
  color: ${errorColor};
`;
const ErrorRep = ({ stringValue, isTruncated }) => (
  <ErrorText>
    <Truncator string={stringValue} {...{ isTruncated }} />
  </ErrorText>
);
ErrorRep.propTypes = {
  stringValue: PropTypes.string.isRequired,
  isTruncated: PropTypes.bool.isRequired
};

const RepsMetaMore = ({ number }) => <Ell>⋯{number} more⋯</Ell>;
RepsMetaMore.propTypes = {
  number: PropTypes.number.isRequired
};

const PropLabelText = styled(RepBaseText)`
  color: ${propLabelColor};
`;
const RepsMetaPropLabel = ({ stringValue, isTruncated }) => (
  <>
    <PropLabelText>
      <Truncator string={stringValue} {...{ isTruncated }} />
    </PropLabelText>
  </>
);
RepsMetaPropLabel.propTypes = {
  stringValue: PropTypes.string.isRequired,
  isTruncated: PropTypes.bool.isRequired
};

const RepsMetaPropStringLabel = createQuotedStringRep('"', '"', propLabelColor);

const typeToTinyRepMapping = {
  Number: stringValueWithColor(numberColor),
  Boolean: stringValueWithColor(boolColor),
  Undefined: stringValueWithColor(nullUndefinedColor),
  Null: stringValueWithColor(nullUndefinedColor),
  Error: ErrorRep,
  Object: ObjectRep,
  Date: stringValueWithColor(dateColor),
  RegExp: RegexRep,
  String: StringRep,
  Symbol: SymbolRep,

  Array: ObjectRep,

  ArrayBuffer: ObjectRep,
  DataView: ObjectRep,

  Int8Array: ObjectRep,
  Int16Array: ObjectRep,
  Int32Array: ObjectRep,

  Uint8Array: ObjectRep,
  Uint8ClampedArray: ObjectRep,
  Uint16Array: ObjectRep,
  Uint32Array: ObjectRep,

  Float32Array: ObjectRep,
  Float64Array: ObjectRep,

  Function: FunctionRep,
  GeneratorFunction: FunctionRep,

  Map: ObjectRep,
  Set: ObjectRep,

  WeakSet: ObjectRep,
  WeakMap: ObjectRep,

  REPS_META_MORE: RepsMetaMore,
  REPS_META_PROP_LABEL: RepsMetaPropLabel,
  REPS_META_PROP_STRING_LABEL: RepsMetaPropStringLabel
};

const repMappingHandledTypes = Object.keys(typeToTinyRepMapping);

export const getValueSummaryRepForType = objType => {
  const repTypeToUse = repMappingHandledTypes.includes(objType)
    ? objType
    : "Object";
  return typeToTinyRepMapping[repTypeToUse];
};

const MAX_TINY_STRING_LEN = 20;
const TINY_REP_TRUNCATION_LEN = 12;

export default class ValueSummary extends React.Component {
  static propTypes = {
    objType: PropTypes.string.isRequired,
    tiny: PropTypes.bool,
    isTruncated: PropTypes.bool,
    size: PropTypes.number,
    stringValue: PropTypes.string
  };
  render() {
    const { objType, tiny, size } = this.props;
    const ValueSummaryRepForType = getValueSummaryRepForType(objType);

    // if we want the tiny rep, if needed, shorten the string even further
    const { stringValue, isTruncated } = truncateString(
      this.props.stringValue,
      tiny ? MAX_TINY_STRING_LEN : Infinity,
      TINY_REP_TRUNCATION_LEN
    );
    const finalTruncationStatus = isTruncated || this.props.isTruncated;

    return (
      <ValueSummaryRepForType
        isTruncated={finalTruncationStatus}
        {...{ stringValue, size }}
      />
    );
  }
}
