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

const RepBaseStyledSpan = color => styled("span")`
  color: ${color};
  font-family: Menlo, monospace;
  font-size: 12px;
  line-height: 14px;
`;

const TinyStringValueWithColor = color => {
  const ValueSpan = RepBaseStyledSpan(color);
  return x => <ValueSpan>{x.stringValue}</ValueSpan>;
};

const ClassInfoSpan = RepBaseStyledSpan(classInfoColor);

const ObjectRep = ({ objClass, size }) => (
  <ClassInfoSpan>
    {objClass}({size})
  </ClassInfoSpan>
);

const Sep = RepBaseStyledSpan(separatorColor);
const Ell = RepBaseStyledSpan(ellipsisColor);
const StringSpan = RepBaseStyledSpan(stringColor);
const QuotedStringRep = (lQuote, rQuote) => ({
  size,
  stringValue,
  isTruncated
}) => (
  <span>
    <Sep>{lQuote}</Sep>
    <StringSpan>{stringValue}</StringSpan>
    {isTruncated ? <Ell>⋯</Ell> : ""}
    <Sep>{rQuote}</Sep>
    {isTruncated ? <ClassInfoSpan>({size})</ClassInfoSpan> : ""}
  </span>
);

const StringRep = QuotedStringRep('"', '"');
const RegexRep = QuotedStringRep("/", "/");

const SymbolSpan = RepBaseStyledSpan(symbolColor);
const SymbolRep = ({ stringValue, isTruncated }) => (
  <span>
    <SymbolSpan>{stringValue}</SymbolSpan>
    {isTruncated ? (
      <React.Fragment>
        <Ell>⋯</Ell>
        <SymbolSpan>)</SymbolSpan>
      </React.Fragment>
    ) : (
      ""
    )}
  </span>
);

const FunctionSpan = styled(RepBaseStyledSpan(functionColor))`
  font-style: italic;
`;
const FunctionRep = ({ objClass, stringValue, isTruncated }) => (
  <span>
    <FunctionSpan>
      ƒ{objClass === "GeneratorFunction" ? "*" : ""} {stringValue}
    </FunctionSpan>
    {isTruncated ? <Ell>⋯</Ell> : ""}
    <FunctionSpan>()</FunctionSpan>
  </span>
);

const ErrorSpan = RepBaseStyledSpan(errorColor);
const ErrorRep = ({ objClass }) => <ErrorSpan>{objClass}</ErrorSpan>;

const typeToTinyRepMapping = {
  Number: TinyStringValueWithColor(numberColor),
  Boolean: TinyStringValueWithColor(boolColor),
  Undefined: TinyStringValueWithColor(nullUndefinedColor),
  Null: TinyStringValueWithColor(nullUndefinedColor),
  Error: ErrorRep,
  Object: ObjectRep,
  Date: TinyStringValueWithColor(dateColor),
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
  WeakMap: ObjectRep
};

const handledTypes = Object.keys(typeToTinyRepMapping);

export default class TinyRep extends React.Component {
  static propTypes = {
    serializedObj: PropTypes.shape({
      objClass: PropTypes.string.isRequired,
      objType: PropTypes.string.isRequired,
      size: PropTypes.number,
      stringValue: PropTypes.string.isRequired,
      isTruncated: PropTypes.bool.isRequired
    })
  };
  render() {
    const { objType } = this.props.serializedObj;
    const repType = handledTypes.includes(objType) ? objType : "Object";
    return typeToTinyRepMapping[repType](this.props.serializedObj);
  }
}
// function tinyRep(serializedObj) {
//   const type = handledTypes.includes(serializedObj.objType)
//     ? serializedObj.objType
//     : "Object";
//   return typeToTinyRepMapping[type](serializedObj);
// }
