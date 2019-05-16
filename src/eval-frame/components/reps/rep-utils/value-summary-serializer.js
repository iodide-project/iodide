import { truncateString } from "./truncate-string";

export function getClass(obj) {
  if (obj === null) return "Null";
  if (obj === undefined) return "Undefined";
  try {
    return obj.constructor.name;
  } catch (error) {
    return "CLASS CANNOT DETERMINED";
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
  if (obj === null) return undefined;
  if (obj === undefined) return undefined;
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

// export const MAX_TINY_STRING_LEN = 20;
// const TINY_REP_TRUNCATION_LEN = 12;

// export const tinyRepStringify = obj =>
//   truncateString(
//     repStringVal(obj, true),
//     MAX_TINY_STRING_LEN,
//     TINY_REP_TRUNCATION_LEN
//   );

// export function serializeForTinyRep(obj) {
//   const { stringValue, isTruncated } = tinyRepStringify(obj);
//   return {
//     objClass: getClass(obj),
//     objType: getType(obj),
//     size: objSize(obj),
//     stringValue,
//     isTruncated
//   };
// }

const MAX_SUMMARY_STRING_LEN = 500;
const SUMMARY_STRING_TRUNCATION_LEN = 300;

export function serializeForValueSummary(obj) {
  const { stringValue, isTruncated } = truncateString(
    repStringVal(obj, true),
    MAX_SUMMARY_STRING_LEN,
    SUMMARY_STRING_TRUNCATION_LEN
  );
  return {
    objType: getType(obj),
    size: objSize(obj),
    stringValue,
    isTruncated
  };
}
