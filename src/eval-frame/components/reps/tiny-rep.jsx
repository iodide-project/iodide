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

const RepBaseText = styled("span")`
  font-family: Menlo, monospace;
  font-size: 12px;
  line-height: 14px;
  cursor: pointer;
`;

const TinyStringValueWithColor = color => {
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
`;
const Ellipsis = () => <Ell>⋯</Ell>;

const Sep = styled(RepBaseText)`
  color: ${separatorColor};
`;

const StringText = styled(RepBaseText)`
  color: ${stringColor};
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
