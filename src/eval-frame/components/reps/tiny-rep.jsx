import React from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";

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

const ObjectRep = ({ objClass, size }) => (
  <ClassInfoText>
    {objClass}({size})
  </ClassInfoText>
);
ObjectRep.propTypes = {
  objClass: PropTypes.string.isRequired,
  size: PropTypes.number
};

const Ell = styled(RepBaseText)`
  color: ${ellipsisColor};
  background: #e7e7e7;
  border-radius: 3px;
`;
const Ellipsis = () => <Ell>⋯</Ell>;

const Sep = styled(RepBaseText)`
  color: ${separatorColor};
`;

const StringText = styled(RepBaseText)`
  color: ${stringColor};
  overflow-wrap: anywhere;
`;
const createQuotedStringRep = (lQuote, rQuote) => {
  const InnerQuotedStringRep = ({ size, stringValue, isTruncated }) => (
    <span>
      <Sep>{lQuote}</Sep>
      <StringText>{stringValue}</StringText>
      {isTruncated ? <Ellipsis /> : ""}
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
    <SymbolText>{stringValue}</SymbolText>
    {isTruncated ? (
      <React.Fragment>
        <Ellipsis />
        <SymbolText>)</SymbolText>
      </React.Fragment>
    ) : (
      ""
    )}
  </span>
);
SymbolRep.propTypes = {
  stringValue: PropTypes.string.isRequired,
  isTruncated: PropTypes.bool.isRequired
};

const FunctionText = styled(RepBaseText)`
  color: ${functionColor}
  font-style: italic;
`;
const FunctionRep = ({ objClass, stringValue, isTruncated }) => (
  <span>
    <FunctionText>
      ƒ{objClass === "GeneratorFunction" ? "*" : ""} {stringValue}
    </FunctionText>
    {isTruncated ? <Ellipsis /> : ""}
    <FunctionText>()</FunctionText>
  </span>
);
FunctionRep.propTypes = {
  objClass: PropTypes.string.isRequired,
  stringValue: PropTypes.string.isRequired,
  isTruncated: PropTypes.bool.isRequired
};

const ErrorText = styled(RepBaseText)`
  color: ${errorColor};
`;
const ErrorRep = ({ objClass }) => <ErrorText>{objClass}</ErrorText>;
ErrorRep.propTypes = {
  objClass: PropTypes.string.isRequired
};

const RepsMetaArrayMore = ({ number }) => <Ell>⋯{number}⋯</Ell>;
RepsMetaArrayMore.propTypes = {
  number: PropTypes.number.isRequired
};

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

  REPS_META_ARRAY_MORE: RepsMetaArrayMore
};

const repMappingHandledTypes = Object.keys(typeToTinyRepMapping);

export const labelRepForType = (serializedObj, objType) => {
  const repType = repMappingHandledTypes.includes(objType) ? objType : "Object";
  return typeToTinyRepMapping[repType](serializedObj);
};

export default class TinyRep extends React.Component {
  static propTypes = {
    objType: PropTypes.string.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    isTruncated: PropTypes.bool.isRequired,
    objClass: PropTypes.string.isRequired,
    size: PropTypes.number,
    stringValue: PropTypes.string.isRequired
    /* eslint-enable react/no-unused-prop-types */
  };
  render() {
    const { objType } = this.props.serializedObj;
    return labelRepForType(this.props.serializedObj, objType);
  }
}
