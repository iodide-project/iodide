import { truncateString } from "./truncate-string";
import { ValueSummary } from "./rep-serialization-core-types";

export function getClass(obj) {
  if (obj === null) return "Null";
  if (obj === undefined) return "Undefined";
  try {
    return obj.constructor.name;
  } catch (error) {
    return "CLASS CANNOT BE DETERMINED";
  }
}

export const getType = obj =>
  Object()
    .toString.call(obj)
    .split(" ")[1]
    .slice(0, -1);

const typesWithLength = [
  "Array",

  "String",

  "Int8Array",
  "Int16Array",
  "Int32Array",

  "Uint8Array",
  "Uint8ClampedArray",
  "Uint16Array",
  "Uint32Array",

  "Float32Array",
  "Float64Array",

  "Function",
  "GeneratorFunction"
];

const typesWithByteLength = ["ArrayBuffer", "DataView"];

const typesWithSize = ["Map", "Set", "Blob"];

export function objSize(obj) {
  if (obj === null) return 0;
  if (obj === undefined) return 0;
  const type = getType(obj);
  if (type === "RegExp") return obj.source.length;
  if (typesWithLength.includes(type)) return obj.length;
  if (typesWithByteLength.includes(type)) return obj.byteLength;
  if (typesWithSize.includes(type)) return obj.size;
  return Object.getOwnPropertyNames(obj).length;
}

export function repStringVal(obj, tiny = false) {
  const type = getType(obj);
  let stringVal;
  if (["Number", "Boolean", "Undefined", "Null", "Symbol"].includes(type)) {
    stringVal = String(obj);
  } else if (type === "Date") {
    stringVal = tiny ? obj.toISOString().slice(0, 19) : obj.toISOString();
  } else if (type === "RegExp") {
    stringVal = obj.source;
  } else if (type === "String") {
    stringVal = obj;
  } else if (type === "Error") {
    stringVal = getClass(obj);
  } else if (type === "Function") {
    stringVal = `ƒ ${obj.name}`;
  } else if (type === "GeneratorFunction") {
    stringVal = `ƒ* ${obj.name}`;
  } else {
    stringVal = getClass(obj);
  }
  return stringVal;
}

export const MAX_SUMMARY_STRING_LEN = 1000;
export const SUMMARY_STRING_TRUNCATION_LEN = 500;

export function serializeForValueSummary(obj) {
  const { stringValue, isTruncated } = truncateString(
    repStringVal(obj, true),
    MAX_SUMMARY_STRING_LEN,
    SUMMARY_STRING_TRUNCATION_LEN
  );
  return new ValueSummary(getType(obj), objSize(obj), stringValue, isTruncated);
}
