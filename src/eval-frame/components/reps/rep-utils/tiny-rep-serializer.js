export function getClass(obj) {
  if (obj === null) return "Null";
  if (obj === undefined) return "Undefined";
  return obj.constructor.name;
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

export const MAX_TINY_STRING_LEN = 20;
const TRUNCATION_LEN = 12;

const truncateString = s =>
  s.length > MAX_TINY_STRING_LEN
    ? [s.slice(0, TRUNCATION_LEN), true]
    : [s, false];

export function tinyRepStringify(obj) {
  const type = getType(obj);
  let stringVal;
  if (["Number", "Boolean", "Undefined", "Null", "Symbol"].includes(type)) {
    stringVal = String(obj);
  } else if (type === "Date") {
    stringVal = obj.toISOString().slice(0, 19);
  } else if (type === "RegExp") {
    stringVal = obj.source;
  } else if (type === "String") {
    stringVal = obj;
  } else if (["Function", "GeneratorFunction"].includes(type)) {
    stringVal = obj.name;
  } else {
    stringVal = "";
  }
  return truncateString(stringVal);
}

export function serializeForTinyRep(obj) {
  const [stringValue, isTruncated] = tinyRepStringify(obj);
  return {
    objClass: getClass(obj),
    objType: getType(obj),
    size: objSize(obj),
    stringValue,
    isTruncated
  };
}
