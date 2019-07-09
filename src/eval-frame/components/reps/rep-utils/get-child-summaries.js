import { isString } from "lodash";
import { serializeChildSummary } from "./child-summary-serializer";
import { MAX_SUMMARY_STRING_LEN } from "./value-summary-serializer";
import {
  ChildSummary,
  ChildSummaryItem,
  RangeDescriptor
} from "./rep-serialization-core-types";
import { splitIndexRange, RANGE_SPLIT_THRESHOLD } from "./split-index-range";

export function expandRangesInChildSummaries(childSummaries) {
  const { childItems } = childSummaries;
  const finalSubpaths = [];
  for (const summaryItem of childItems) {
    if (summaryItem.summary !== null) {
      // this is a valueSummary, and does not need to be split
      finalSubpaths.push(summaryItem);
    } else {
      // summaryItem.path is a RangeDescriptor; may need to be split
      const rangeDescriptors = splitIndexRange(summaryItem.path);
      // append all the resulting sub-ranges
      for (const rangeSummary of rangeDescriptors) {
        finalSubpaths.push(new ChildSummaryItem(rangeSummary, null));
      }
    }
  }

  return new ChildSummary(finalSubpaths);
}

function getIteratorAtIndex(iterator, index) {
  // this is inefficient, but required for dealing with maps, sets,
  // and any other object that doesn't allow lookup by index
  let i = 0;
  for (const item of iterator) {
    if (i === index) return item;
    i += 1;
  }
  throw new RangeError("map index not found in iterator");
}

function getObjAtPath(baseObj, repPath) {
  const queryPath = repPath.filter(p => !(p instanceof RangeDescriptor));

  let obj = baseObj;
  let index = 0;
  const { length } = queryPath;

  while (obj != null && index < length) {
    const pathElt = queryPath[index];
    if (obj instanceof Map) {
      // figure out the index of the key/val pair in map.entries()
      if (Number.isFinite(pathElt)) {
        throw new TypeError(
          "immediate subpaths of a map must be numeric entries index"
        );
      }
      const mapEntryIndex = Number(pathElt);
      // then immediately advance down the path to see if this key or a value
      index += 1;
      const keyOrVal = queryPath[index];
      if (keyOrVal !== "MAP_KEY" && keyOrVal !== "MAP_VAL") {
        throw new TypeError(
          "paths into a map object must have MAP_KEY or MAP_VAL after the index into map.entries"
        );
      }
      obj =
        keyOrVal === "MAP_KEY"
          ? getIteratorAtIndex(obj.keys(), mapEntryIndex)
          : getIteratorAtIndex(obj.values(), mapEntryIndex);
    } else {
      obj = obj[pathElt];
    }
    index += 1;
  }
  return obj;
}

export function getChildSummary(rootObjName, path) {
  const pathEnd = path[path.length - 1];
  if (isString(pathEnd)) {
    // if the last item in the path is a string,
    // serialize the object at the end of the path, dropping
    // non-string path elements (which are indexRanges)
    const childSummaries = serializeChildSummary(
      getObjAtPath(window[rootObjName], path.filter(isString))
    );
    return childSummaries;
  }
  // if the end of the path is not a string, it must be an RangeDescriptor.
  // Either break it up appropriately, or return the data for that range
  const { min, max, type } = pathEnd;
  const rangeSize = max - min;
  if (type === "STRING_RANGE" && rangeSize > MAX_SUMMARY_STRING_LEN) {
    return new ChildSummary(
      splitIndexRange(pathEnd, MAX_SUMMARY_STRING_LEN).map(
        range => new ChildSummaryItem(range, null)
      )
    );
  } else if (type !== "STRING_RANGE" && rangeSize > RANGE_SPLIT_THRESHOLD) {
    // if this range is too big, expand into subranges
    const tempChildSummariesForExpansion = new ChildSummary([
      new ChildSummaryItem(pathEnd, null)
    ]);

    return expandRangesInChildSummaries(tempChildSummariesForExpansion);
  }

  // ELSE: if it's not too big, get the summary for this range
  return serializeChildSummary(
    getObjAtPath(window[rootObjName], path),
    pathEnd
  );
}
