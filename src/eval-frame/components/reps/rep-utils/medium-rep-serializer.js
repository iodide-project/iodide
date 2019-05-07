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

export function serializeArrayPathsSummary(
  arr,
  maxLength = 20,
  headPreview = 5,
  tailPreview = 5
) {
  if (arr.length === 0) {
    return [];
  }

  // can't use a plain map in this fnc this b/c it doesn't work with typed arrays
  if (arr.length <= maxLength) {
    return range(arr.length).map(i => serializeForTinyRep(arr[i]));
  }

  return [
    ...range(headPreview).map(i => serializeForTinyRep(arr[i])),
    {
      objType: "REPS_META_ARRAY_MORE",
      number: arr.length - headPreview - tailPreview
    },
    ...range(arr.length - tailPreview, arr.length).map(i =>
      serializeForTinyRep(arr[i])
    )
    // ...arr.slice(-tailPreview).map(obj => serializeForTinyRep(obj))
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
