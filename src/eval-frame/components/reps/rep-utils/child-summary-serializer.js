import { range, isFinite } from "lodash";
import {
  getType,
  getClass,
  objSize,
  repStringVal,
  serializeForValueSummary
} from "./value-summary-serializer";
import { truncateString } from "./truncate-string";
import { isValidIdentifier } from "../../../../shared/utils/is-valid-js-identifier";
import {
  RangeDescriptor,
  ChildSummary,
  ChildSummaryItem
} from "./rep-serialization-core-types";

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

export function serializeArrayPathsSummary(
  arr,
  maxLength = 20,
  headPreview = 5,
  tailPreview = 5
) {
  if (arr.length === 0) {
    return [];
  }

  const summarizeIndex = i =>
    new ChildSummaryItem(String(i), serializeForValueSummary(arr[i]));

  // can't use a plain Array.map in this fnc this b/c it doesn't work with typed arrays
  if (arr.length <= maxLength) {
    return range(arr.length).map(summarizeIndex);
  }

  return [
    ...range(headPreview).map(summarizeIndex),
    {
      summary: null,
      path: new RangeDescriptor(
        headPreview,
        arr.length - headPreview - 1,
        "ARRAY_RANGE"
      )
    },
    ...range(arr.length - tailPreview, arr.length).map(summarizeIndex)
  ];
}

export function serializeArrayPathsForRange(arr, min, max) {
  if (min >= max) {
    return [];
  }

  const summarizeIndex = i =>
    new ChildSummaryItem(String(i), serializeForValueSummary(arr[i]));

  return range(min, max + 1).map(i => summarizeIndex(i));
}

function serializeObjectPathsSummary(obj, maxToSerialize = 50) {
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
      summary: null,
      path: new RangeDescriptor(
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
    return new ChildSummary(
      serializeArrayPathsSummary(obj),
      "ARRAY_PATH_SUMMARY"
    );
    // } else if (type === "Map") {
    //   return {
    //     childItems: serializeMapPathsSummary(obj),
    //     summaryType: "MAP_PATH_SUMMARY"
    //   };
    // } else if (type === "Set") {
    //   return {
    //     childItems: serializeSetPathsSummary(obj),
    //     summaryType: "SET_PATH_SUMMARY"
    //   };
  } else if (
    type === "Object" ||
    getClass(obj) === "Object" ||
    BrowserTypes.includes(type)
  ) {
    return new ChildSummary(
      serializeObjectPathsSummary(obj),
      "OBJECT_PATH_SUMMARY"
    );
  }

  return new ChildSummary([], "ATOMIC_VALUE");
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

export function isValidChildSumary(maybeSummary) {
  const { childItems, summaryType } = maybeSummary;
  if (childItems === undefined)
    return ["top-level 'childItems' is undefined", maybeSummary];
  if (summaryType === undefined)
    return ["top-level 'summaryType' is undefined", maybeSummary];

  if (getType(summaryType) !== "String") return "'summaryType' is not string";
  if (getType(childItems) !== "Array") return "'childItems' not array";
  for (const summaryItem of childItems) {
    const { path, summary } = summaryItem;
    if (path === undefined)
      return ["summaryItem'path' is undefined", summaryItem];
    if (summary === undefined)
      return ["summaryItem 'summary' is undefined", summaryItem];

    // paths must be strings or path descriptions
    const pathIsString = getType(path) === "String";
    const pathIsRangeDesc = path.min !== undefined && path.max !== undefined;
    if (!(pathIsString || pathIsRangeDesc))
      return ["invalid 'path' in summaryItem", path, summary];

    // pathIsRangeDesc must have valid max/min numbers
    if (pathIsRangeDesc && (!isFinite(path.min) || !isFinite(path.max)))
      return ["invalid RangeDescriptor", path, summary];

    // the summary must be null or a valid summary
    const summaryIsNull = summary === null;
    const isValueSummaryObj =
      summary !== null &&
      (summary.objType !== undefined &&
        summary.size !== undefined &&
        summary.stringValue !== undefined &&
        summary.isTruncated !== undefined);

    if (!isValueSummaryObj && !summaryIsNull) {
      return ["invalid value summary", path, summary];
    }
    // if summary is null iff pathIsRangeDesc
    if (pathIsRangeDesc !== summaryIsNull)
      return ["failed pathIsRangeDesc IFF summaryIsNull", path, summary];
  }
  return true;
}
