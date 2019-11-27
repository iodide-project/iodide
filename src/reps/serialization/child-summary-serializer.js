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
  newRangeDescriptor,
  isRangeDescriptor,
  newChildSummary,
  newChildSummaryItem,
  newSubstringRangeSummaryItem,
  newMapPairSummaryItem
} from "../shared/rep-serialization-core-types";

import { splitIndexRange } from "./split-index-range";
import { numericIndexTypes, objectLikeTypes } from "../shared/type-categories";

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
    newChildSummaryItem(String(i), serializeForValueSummary(arr[i]));

  // can't use a plain Array.map in this fnc this b/c it doesn't work with typed arrays
  if (arr.length <= maxLength) {
    return range(arr.length).map(summarizeIndex);
  }

  return [
    ...range(headPreview).map(summarizeIndex),
    newChildSummaryItem(
      newRangeDescriptor(
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
    newChildSummaryItem(String(i), serializeForValueSummary(arr[i]));

  return range(min, max + 1).map(i => summarizeIndex(i));
}

//  OBJECTS

function serializeObjectPathsSummary(obj, maxToSerialize = 50) {
  const objectProps = Object.getOwnPropertyNames(obj);
  const summarizeProp = prop =>
    newChildSummaryItem(prop, serializeForValueSummary(obj[prop]));

  if (objectProps.length === 0) {
    return [];
  }

  if (objectProps.length <= maxToSerialize) {
    return objectProps.map(summarizeProp);
  }

  return [
    ...objectProps.slice(0, maxToSerialize).map(summarizeProp),
    newChildSummaryItem(
      newRangeDescriptor(maxToSerialize, objectProps.length, "PROPS_RANGE"),
      null
    )
  ];
}

export function serializeObjectPropsPathsForRange(obj, min, max) {
  if (min >= max) {
    return [];
  }
  const summarizeProp = prop =>
    newChildSummaryItem(prop, serializeForValueSummary(obj[prop]));

  const objectProps = Object.getOwnPropertyNames(obj);
  return objectProps.slice(min, max + 1).map(summarizeProp);
}

//  STRINGS

function serializeStringPathsSummary(strObj) {
  if (strObj.length <= MAX_SUMMARY_STRING_LEN) return [];

  const initialRange = newRangeDescriptor(
    SUMMARY_STRING_TRUNCATION_LEN,
    strObj.length,
    "STRING_RANGE"
  );

  return splitIndexRange(
    initialRange,
    MAX_SUMMARY_STRING_LEN
  ).map(rangeDescriptor => newChildSummaryItem(rangeDescriptor, null));
}

export function serializeStringSummaryForRange(strObj, min, max) {
  return [
    newSubstringRangeSummaryItem(
      newRangeDescriptor(min, max, "STRING_RANGE"),
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
        newChildSummaryItem(
          newRangeDescriptor(i, objSize(set), "SET_INDEX_RANGE"),
          null
        )
      );
      return childItems;
    }
    childItems.push(
      newChildSummaryItem(String(i), serializeForValueSummary(value))
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
        newChildSummaryItem(String(i), serializeForValueSummary(value))
      );
    }
    i += 1;
  }
  return childItems;
}

// FIXME the functions above can be refactored and consolidated following
// the patterrn of serializeMapPathsSummary. Maybe possible to simplify
// down two path summary fncs, one for iterables and another for
// indexables/slicables?

// MAP
export function serializeMapPathsSummary(map, min, max, addTailRange) {
  const childItems = [];
  let i = 0;
  // this is not an efficient way to do this, but JS
  // sets only let you loop over the whole `values` enum,
  // you can't look up by index
  for (const [key, value] of map.entries()) {
    if (i > max) {
      if (addTailRange) {
        childItems.push(
          newChildSummaryItem(
            newRangeDescriptor(i, objSize(map), "MAP_INDEX_RANGE"),
            null
          )
        );
      }
      return childItems;
    } else if (i >= min) {
      childItems.push(
        newMapPairSummaryItem(
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

export function serializeChildSummary(obj, rangeDescriptor) {
  const rangeSummary = rangeDescriptor && isRangeDescriptor(rangeDescriptor);

  const { min, max } = rangeSummary ? rangeDescriptor : { min: 0, max: 5 };

  const type = getType(obj);
  let childItems;

  if (numericIndexTypes.includes(type)) {
    childItems = rangeSummary
      ? serializeArrayPathsForRange(obj, min, max)
      : serializeArrayPathsSummary(obj);
  } else if (type === "Map") {
    childItems = serializeMapPathsSummary(obj, min, max, !rangeSummary);
  } else if (type === "Set") {
    childItems = rangeSummary
      ? serializeSetIndexPathsForRange(obj, min, max)
      : serializeSetPathsSummary(obj);
  } else if (type === "String") {
    childItems = rangeSummary
      ? serializeStringSummaryForRange(obj, min, max)
      : serializeStringPathsSummary(obj);
  } else if (
    type === "Object" ||
    getClass(obj) === "Object" ||
    objectLikeTypes.includes(type)
  ) {
    childItems = rangeSummary
      ? serializeObjectPropsPathsForRange(obj, min, max)
      : serializeObjectPathsSummary(obj);
  } else {
    childItems = [];
  }
  return newChildSummary(childItems);
}
