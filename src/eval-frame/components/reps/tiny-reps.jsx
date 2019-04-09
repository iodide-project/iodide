import React from "react";
import styled from "react-emotion";

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

const tinyStringValueWithColor = color => {
  const ValueSpan = RepBaseStyledSpan(color);
  return x => <ValueSpan>{x.stringValue}</ValueSpan>;
};

const ClassInfoSpan = RepBaseStyledSpan(classInfoColor);

const objectRep = obj => (
  <ClassInfoSpan>
    {obj.class}({obj.size})
  </ClassInfoSpan>
);

const Sep = RepBaseStyledSpan(separatorColor);
const Ell = RepBaseStyledSpan(ellipsisColor);
const StringSpan = RepBaseStyledSpan(stringColor);
const quotedStringRep = (lQuote, rQuote) => obj => (
  <span>
    <Sep>{lQuote}</Sep>
    <StringSpan>{obj.stringValue}</StringSpan>
    {obj.isTruncated ? <Ell>⋯</Ell> : ""}
    <Sep>{rQuote}</Sep>
    {obj.isTruncated ? <ClassInfoSpan>({obj.size})</ClassInfoSpan> : ""}
  </span>
);

const stringRep = quotedStringRep('"', '"');
const regexRep = quotedStringRep("/", "/");

const SymbolSpan = RepBaseStyledSpan(symbolColor);
const symbolRep = obj => (
  <span>
    <SymbolSpan>{obj.stringValue}</SymbolSpan>
    {obj.isTruncated ? (
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
const functionRep = obj => (
  <span>
    <FunctionSpan>
      ƒ{obj.class === "GeneratorFunction" ? "*" : ""} {obj.stringValue}
    </FunctionSpan>
    {obj.isTruncated ? <Ell>⋯</Ell> : ""}
    <FunctionSpan>()</FunctionSpan>
  </span>
);

const ErrorSpan = RepBaseStyledSpan(errorColor);
const errorRep = obj => <ErrorSpan>{obj.class}</ErrorSpan>;

const typeToTinyRepMapping = {
  Number: tinyStringValueWithColor(numberColor),
  Boolean: tinyStringValueWithColor(boolColor),
  Undefined: tinyStringValueWithColor(nullUndefinedColor),
  Null: tinyStringValueWithColor(nullUndefinedColor),
  String: stringRep,
  Symbol: symbolRep,
  Array: objectRep,
  ArrayBuffer: objectRep,
  DataView: objectRep,
  Int8Array: objectRep,
  Uint8Array: objectRep,
  Uint8ClampedArray: objectRep,
  Int16Array: objectRep,
  Uint16Array: objectRep,
  Int32Array: objectRep,
  Uint32Array: objectRep,
  Float32Array: objectRep,
  Float64Array: objectRep,
  Function: functionRep,
  GeneratorFunction: functionRep,
  Error: errorRep,
  Object: objectRep,
  Date: tinyStringValueWithColor(dateColor),
  RegExp: regexRep,
  Map: objectRep,
  Set: objectRep,
  WeakSet: objectRep,
  WeakMap: objectRep
};

const handledTypes = Object.keys(typeToTinyRepMapping);

export default function tinyRep(serializedObj) {
  const type = handledTypes.includes(serializedObj.type)
    ? serializedObj.type
    : "Object";
  return typeToTinyRepMapping[type](serializedObj);
}
