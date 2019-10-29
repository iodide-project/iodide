export const numericIndexTypes = [
  "Array",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Uint16Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array"
];
export const objectLikeTypes = [
  "HTMLCollection",
  "Window",
  "HTMLDocument",
  "HTMLBodyElement",
  "Promise",
  "Error"
];

export const typesWithLength = [
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
  "Float64Array"
];

export const typesWithZeroLength = [
  "Function",
  "GeneratorFunction",
  "Null",
  "Undefined"
];

export const nonExpandableTypes = [
  "Function",
  "GeneratorFunction",
  "Date",
  "RegExp",
  "ArrayBuffer",
  "DataView",
  "Blob"
];

export const typesWithByteLength = ["ArrayBuffer", "DataView"];

export const typesWithSize = ["Map", "Set", "Blob"];
