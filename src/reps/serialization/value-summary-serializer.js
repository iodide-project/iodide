import { truncateString } from "../shared/truncate-string";
import { newValueSummary } from "../shared/rep-serialization-core-types";
import {
  typesWithLength,
  typesWithZeroLength,
  typesWithByteLength,
  typesWithSize,
  nonExpandableTypes
} from "../shared/type-categories";

export function getClass(obj) {
  if (obj === null) return "Null";
  if (obj === undefined) return "Undefined";
  try {
    return Object.getPrototypeOf(obj).constructor.name;
  } catch (error) {
    return "<unknown>";
  }
}

export const getType = obj => {
  const type = Object()
    .toString.call(obj)
    .split(" ")[1]
    .slice(0, -1);

  // handle broad type categories that don't need further specification
  if (["Object", "Error", "Function"].includes(type)) {
    return type;
  }
  // otherwise, use the class
  return getClass(obj);
};

export function objSize(obj) {
  const type = getType(obj);
  if (type === "Function") return 0;
  if (typesWithZeroLength.includes(type)) return 0;
  if (type === "RegExp") return obj.source.length;
  if (typesWithLength.includes(type)) return obj.length;
  if (typesWithByteLength.includes(type)) return obj.byteLength;
  if (typesWithSize.includes(type)) return obj.size;
  try {
    return Object.getOwnPropertyNames(obj).length;
  } catch (error) {
    return 0;
  }
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
    stringVal = obj.name ? `ƒ ${obj.name}` : "ƒ";
  } else if (type === "GeneratorFunction") {
    stringVal = obj.name ? `ƒ* ${obj.name}` : "ƒ*";
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

  const objType = getType(obj);
  const size = objSize(obj);
  let isExpandable;
  if (nonExpandableTypes.includes(objType)) {
    isExpandable = false;
  } else if (objType === "String") {
    isExpandable = isTruncated;
  } else {
    isExpandable = size > 0;
  }
  return newValueSummary(objType, size, stringValue, isTruncated, isExpandable);
}
