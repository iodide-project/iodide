import { range } from "lodash";
import {
  getType,
  getClass,
  objSize,
  repStringVal,
  serializeForValueSummary
} from "./value-summary-serializer";
import { truncateString } from "./truncate-string";
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

const BrowserTypes = [
  "HTMLCollection",
  "Window",
  "HTMLDocument",
  "HTMLBodyElement",
  "Promise"
];

const rangeDescriptor = (min, max, type) => ({ min, max, type });

export function serializeArrayPathsSummary(
  arr,
  maxLength = 20,
  headPreview = 5,
  tailPreview = 5
) {
  if (arr.length === 0) {
    return [];
  }

  const summarizeIndex = i => ({
    path: i,
    summary: serializeForValueSummary(arr[i])
  });

  // can't use a plain Array.map in this fnc this b/c it doesn't work with typed arrays
  if (arr.length <= maxLength) {
    return range(arr.length).map(summarizeIndex);
  }

  return [
    ...range(headPreview).map(summarizeIndex),
    {
      path: null,
      summary: rangeDescriptor(
        headPreview,
        arr.length - headPreview - 1,
        "ARRAY_RANGE"
      )
    },
    ...range(arr.length - tailPreview, arr.length).map(summarizeIndex)
  ];
}

// export function serializePropertyLabel(propString) {
//   const serialized = serializeForValueSummary(propString);
//   if (!isValidIdentifier(propString)) {
//     serialized.objType = "REPS_META_PROP_STRING_LABEL";
//     return serialized;
//   }

//   serialized.objType = "REPS_META_PROP_LABEL";
//   return serialized;
// }

function serializeObjectPathsSummary(obj, maxToSerialize = 50) {
  // const summary = [];
  // let i = 0;
  const objectProps = Object.getOwnPropertyNames(obj);
  const summarizeProp = prop => ({
    path: prop,
    summary: serializeForValueSummary(obj[prop])
  });

  if (objectProps.length === 0) {
    return [];
  }

  if (objectProps.length <= maxToSerialize) {
    return objectProps.map(summarizeProp);
  }

  return [
    ...objectProps.slice(0, maxToSerialize).map(summarizeProp),
    {
      path: null,
      summary: rangeDescriptor(
        maxToSerialize,
        objectProps.length,
        "PROPS_RANGE"
      )
    }
  ];
}

function serializeMapPathsSummary(map, previewNum = 5) {
  const summary = [];
  // let i = 0;
  // for (const [key, value] of map.entries()) {
  //   if (i >= previewNum) {
  //     summary.push({
  //       objType: "REPS_META_MORE",
  //       number: objSize(map) - previewNum
  //     });
  //     return summary;
  //   }
  //   summary.push({
  //     path: serializeForValueSummary(key),
  //     summary: serializeForValueSummary(value)
  //   });
  //   i += 1;
  // }
  return summary;
}

// function serializeSetPathsSummary(map, previewNum = 5) {
//   const summary = [];
//   let i = 0;
//   for (const value of map.values()) {
//     if (i >= previewNum) {
//       summary.push({
//         objType: "REPS_META_MORE",
//         number: objSize(map) - previewNum
//       });
//       return summary;
//     }
//     summary.push(serializeForValueSummary(value));
//     i += 1;
//   }
//   return summary;
// }

export function serializeChildSummary(obj) {
  const type = getType(obj);
  if (numericIndexTypes.includes(type)) {
    return {
      subpaths: serializeArrayPathsSummary(obj),
      summaryType: "ARRAY_PATH_SUMMARY"
    };
    // } else if (type === "Map") {
    //   return {
    //     subpaths: serializeMapPathsSummary(obj),
    //     summaryType: "MAP_PATH_SUMMARY"
    //   };
    // } else if (type === "Set") {
    //   return {
    //     subpaths: serializeSetPathsSummary(obj),
    //     summaryType: "SET_PATH_SUMMARY"
    //   };
  } else if (
    type === "Object" ||
    getClass(obj) === "Object" ||
    BrowserTypes.includes(type)
  ) {
    return {
      subpaths: serializeObjectPathsSummary(obj),
      summaryType: "OBJECT_PATH_SUMMARY"
    };
  }
  return { subpaths: [], summaryType: "NO_SUBPATHS" };
}

// const MAX_MEDIUM_STRING_LEN = 500;
// const MEDIUM_REP_TRUNCATION_LEN = 300;

// export function serializeForMediumRep(obj) {
//   const { stringValue, isTruncated } = truncateString(
//     repStringVal(obj),
//     MAX_MEDIUM_STRING_LEN,
//     MEDIUM_REP_TRUNCATION_LEN
//   );
//   const [subpathSummaries, subpathSummaryType] = serializePathsSummary(obj);
//   // console.log("subpathSummaries", subpathSummaries, subpathSummaryType);
//   return {
//     objClass: getClass(obj),
//     objType: getType(obj),
//     size: objSize(obj),
//     stringValue,
//     isTruncated,
//     subpathSummaries,
//     subpathSummaryType
//   };
// }
