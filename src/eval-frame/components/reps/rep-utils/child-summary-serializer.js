import { range } from "lodash";
import {
  getType,
  getClass,
  objSize,
  serializeForValueSummary,
  MAX_SUMMARY_STRING_LEN,
  SUMMARY_STRING_TRUNCATION_LEN
} from "./value-summary-serializer";
import {
  RangeDescriptor,
  ChildSummary,
  ChildSummaryItem,
  StringRangeSummaryItem,
  MapPairSummaryItem
} from "./rep-serialization-core-types";
import { splitIndexRange } from "./split-index-range";

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

const objectLikeTypes = [
  "HTMLCollection",
  "Window",
  "HTMLDocument",
  "HTMLBodyElement",
  "Promise",
  "Error"
];

// ARRAYS

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
    new ChildSummaryItem(
      new RangeDescriptor(
        headPreview,
        arr.length - headPreview - 1,
        "ARRAY_RANGE"
      ),
      null
    ),
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

//  OBJECTS

function serializeObjectPathsSummary(obj, maxToSerialize = 50) {
  const objectProps = Object.getOwnPropertyNames(obj);
  const summarizeProp = prop =>
    new ChildSummaryItem(prop, serializeForValueSummary(obj[prop]));

  if (objectProps.length === 0) {
    return [];
  }

  if (objectProps.length <= maxToSerialize) {
    return objectProps.map(summarizeProp);
  }

  return [
    ...objectProps.slice(0, maxToSerialize).map(summarizeProp),
    new ChildSummaryItem(
      new RangeDescriptor(maxToSerialize, objectProps.length, "PROPS_RANGE"),
      null
    )
  ];
}

export function serializeObjectPropsPathsForRange(obj, min, max) {
  if (min >= max) {
    return [];
  }
  const summarizeProp = prop =>
    new ChildSummaryItem(prop, serializeForValueSummary(obj[prop]));

  const objectProps = Object.getOwnPropertyNames(obj);
  return objectProps.slice(min, max + 1).map(summarizeProp);
}

//  STRINGS

function serializeStringPathsSummary(strObj) {
  if (strObj.length <= MAX_SUMMARY_STRING_LEN) return [];

  const initialRange = new RangeDescriptor(
    SUMMARY_STRING_TRUNCATION_LEN,
    strObj.length,
    "STRING_RANGE"
  );

  console.log("splitting in serializeStringPathsSummary");

  return splitIndexRange(initialRange, MAX_SUMMARY_STRING_LEN).map(
    rangeDescriptor => new ChildSummaryItem(rangeDescriptor, null)
  );
}

export function serializeStringSummaryForRange(strObj, min, max) {
  return [
    new StringRangeSummaryItem(
      new RangeDescriptor(min, max, "STRING_RANGE"),
      serializeForValueSummary(strObj.slice(min, max + 1))
    )
  ];
}

// SETS

function serializeSetPathsSummary(set, previewNum = 5) {
  const childItems = [];
  let i = 0;
  for (const value of set.values()) {
    if (i >= previewNum) {
      childItems.push(
        new ChildSummaryItem(
          new RangeDescriptor(i, objSize(set), "SET_INDEX_RANGE"),
          null
        )
      );
      return childItems;
    }
    childItems.push(
      new ChildSummaryItem(String(i), serializeForValueSummary(value))
    );
    i += 1;
  }
  return childItems;
}

export function serializeSetIndexPathsForRange(set, min, max) {
  const childItems = [];
  let i = 0;
  // this is not an efficient way to do this, but in JS
  // sets only let you loop over the whole enum
  for (const value of set.values()) {
    if (i > max) {
      return childItems;
    } else if (i >= min) {
      childItems.push(
        new ChildSummaryItem(String(i), serializeForValueSummary(value))
      );
    }
    i += 1;
  }
  return childItems;
}

// MAP

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
  } else if (type === "Set") {
    return new ChildSummary(serializeSetPathsSummary(obj), "SET_PATH_SUMMARY");
  } else if (type === "String") {
    return new ChildSummary(
      serializeStringPathsSummary(obj),
      "STRING_PATH_SUMMARY"
    );
  } else if (
    type === "Object" ||
    getClass(obj) === "Object" ||
    objectLikeTypes.includes(type)
  ) {
    return new ChildSummary(
      serializeObjectPathsSummary(obj),
      "OBJECT_PATH_SUMMARY"
    );
  }

  return new ChildSummary([], "ATOMIC_VALUE");
}
