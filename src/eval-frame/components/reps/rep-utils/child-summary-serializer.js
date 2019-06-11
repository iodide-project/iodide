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
  SubstringRangeSummaryItem,
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

export const objectLikeTypes = [
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

  return splitIndexRange(initialRange, MAX_SUMMARY_STRING_LEN).map(
    rangeDescriptor => new ChildSummaryItem(rangeDescriptor, null)
  );
}

export function serializeStringSummaryForRange(strObj, min, max) {
  return [
    new SubstringRangeSummaryItem(
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
  // this is not an efficient way to do this, but JS
  // sets only let you loop over the whole `values` enum,
  // you can't look up by index
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
  const childItems = [];
  let i = 0;
  for (const [key, value] of map.entries()) {
    if (i >= previewNum) {
      childItems.push(
        new ChildSummaryItem(
          new RangeDescriptor(i, objSize(map), "MAP_INDEX_RANGE"),
          null
        )
      );
      return childItems;
    }

    childItems.push(
      new MapPairSummaryItem(
        String(i),
        serializeForValueSummary(key),
        serializeForValueSummary(value)
      )
    );
    i += 1;
  }
  return childItems;
}

export function serializeMapIndexPathsForRange(map, min, max) {
  const childItems = [];
  let i = 0;
  // this is not an efficient way to do this, but JS
  // sets only let you loop over the whole `values` enum,
  // you can't look up by index
  for (const [key, value] of map.entries()) {
    if (i > max) {
      return childItems;
    } else if (i >= min) {
      childItems.push(
        new MapPairSummaryItem(
          String(i),
          serializeForValueSummary(key),
          serializeForValueSummary(value)
        )
      );
    }
    i += 1;
  }
  return childItems;
}

// PUBLIC ENTRY POINT

export function serializeChildSummary(obj) {
  const type = getType(obj);

  if (numericIndexTypes.includes(type)) {
    return new ChildSummary(serializeArrayPathsSummary(obj));
  } else if (type === "Map") {
    return new ChildSummary(serializeMapPathsSummary(obj));
  } else if (type === "Set") {
    return new ChildSummary(serializeSetPathsSummary(obj));
  } else if (type === "String") {
    return new ChildSummary(serializeStringPathsSummary(obj));
  } else if (
    type === "Object" ||
    getClass(obj) === "Object" ||
    objectLikeTypes.includes(type)
  ) {
    return new ChildSummary(serializeObjectPathsSummary(obj));
  }

  return new ChildSummary([]);
}
