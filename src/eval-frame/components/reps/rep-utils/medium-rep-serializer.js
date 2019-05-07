import { range } from "lodash";
import {
  getType,
  getClass,
  objSize,
  repStringVal,
  truncateString,
  serializeForTinyRep
} from "./tiny-rep-serializer";

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

// const atomicTypes = [
//   "Number",
//   "Boolean",
//   "Undefined",
//   "Null",
//   "Symbol",
//   "Date",
//   "RegExp",

//   "Function",
//   "GeneratorFunction"
// ];

const MAX_MEDIUM_ARRAY_LEN = 20;
const MEDIUM_ARRAY_HEAD = 5;
const MEDIUM_ARRAY_TAIL = 5;

export function serializeArrayPathsSummary(arr) {
  if (arr.length === 0) {
    return [];
  }

  // can't use a plain map in this fnc this b/c it doesn't work with typed arrays
  if (arr.length <= MAX_MEDIUM_ARRAY_LEN) {
    return range(arr.length).map(i => serializeForTinyRep(arr[i]));
  }

  return [
    ...range(MEDIUM_ARRAY_HEAD).map(i => serializeForTinyRep(arr[i])),
    {
      objType: "REPS_META_ARRAY_MORE",
      number: arr.length - MEDIUM_ARRAY_HEAD - MEDIUM_ARRAY_TAIL
    },
    ...range(arr.length - MEDIUM_ARRAY_TAIL, arr.length).map(i =>
      serializeForTinyRep(arr[i])
    )
    // ...arr.slice(-MEDIUM_ARRAY_TAIL).map(obj => serializeForTinyRep(obj))
  ];
}

function serializeMapPathsSummary() {}

function serializeObjectPathsSummary() {}

export function serializePathsSummary(obj) {
  const type = getType(obj);
  if (numericIndexTypes.includes(type)) {
    return [serializeArrayPathsSummary(obj), "ARRAY_PATH_SUMMARY"];
  } else if (type === "Map") {
    return [serializeMapPathsSummary(obj), "MAP_PATH_SUMMARY"];
  } else if (type === "Object" || getClass(obj) === "Object") {
    return [serializeObjectPathsSummary(obj), "OBJECT_PATH_SUMMARY"];
  }
  return [undefined, "NO_SUBPATHS"];
}

const MAX_MEDIUM_STRING_LEN = 500;
const MEDIUM_REP_TRUNCATION_LEN = 300;

export function serializeForMediumRep(obj) {
  const [stringValue, isTruncated] = truncateString(
    repStringVal(obj),
    MAX_MEDIUM_STRING_LEN,
    MEDIUM_REP_TRUNCATION_LEN
  );
  const [subpathSummaries, subpathSummaryType] = serializePathsSummary(obj);
  // console.log("subpathSummaries", subpathSummaries, subpathSummaryType);
  return {
    objClass: getClass(obj),
    objType: getType(obj),
    size: objSize(obj),
    stringValue,
    isTruncated,
    subpathSummaries,
    subpathSummaryType
  };
}
