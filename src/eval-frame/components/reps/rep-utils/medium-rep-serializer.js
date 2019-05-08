import { range } from "lodash";
import {
  getType,
  getClass,
  objSize,
  repStringVal,
  truncateString,
  serializeForTinyRep
} from "./tiny-rep-serializer";
import { isValidIdentifier } from "../../../../shared/utils/is-valid-js-identifier";

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

  // can't use a plain Array.map in this fnc this b/c it doesn't work with typed arrays
  if (arr.length <= maxLength) {
    return range(arr.length).map(i => serializeForTinyRep(arr[i]));
  }

  return [
    ...range(headPreview).map(i => serializeForTinyRep(arr[i])),
    {
      objType: "REPS_META_MORE",
      number: arr.length - headPreview - tailPreview
    },
    ...range(arr.length - tailPreview, arr.length).map(i =>
      serializeForTinyRep(arr[i])
    )
  ];
}

export function serializePropertyLabel(propString) {
  const serialized = serializeForTinyRep(propString);
  if (!isValidIdentifier(propString)) {
    serialized.objType = "REPS_META_PROP_STRING_LABEL";
    return serialized;
  }

  serialized.objType = "REPS_META_PROP_LABEL";
  return serialized;
}

function serializeObjectPathsSummary(obj, previewNum = 5) {
  const summary = [];
  let i = 0;
  // note: intionally using for-in because we
  // DO want properties from the prototype chain
  for (const key of Object.getOwnPropertyNames(obj)) {
    if (i >= previewNum) {
      summary.push({
        objType: "REPS_META_MORE",
        number: objSize(obj) - previewNum
      });
      return summary;
    }
    summary.push({
      key: serializePropertyLabel(key),
      value: serializeForTinyRep(obj[key])
    });
    i += 1;
  }
  return summary;
}

function serializeMapPathsSummary(map, previewNum = 5) {
  const summary = [];
  let i = 0;
  for (const [key, value] of map.entries()) {
    if (i >= previewNum) {
      summary.push({
        objType: "REPS_META_MORE",
        number: objSize(map) - previewNum
      });
      return summary;
    }
    summary.push({
      key: serializeForTinyRep(key),
      value: serializeForTinyRep(value)
    });
    i += 1;
  }
  return summary;
}

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
