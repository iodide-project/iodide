import { get, isString } from "lodash";
import {
  serializeChildSummary,
  serializeArrayPathsForRange
} from "./child-summary-serializer";
import { ChildSummary, ChildSummaryItem } from "./rep-serialization-core-types";
import { splitIndexRange } from "./split-index-range";

const RANGE_SPLIT_THRESHOLD = 50;

function targetNumSubRanges(rangeSize) {
  // number of ranges should be min 5 (in the case of a bin with 50 elts)
  // and max 30 for huge ranges (so as to not overwhelm the screen)
  return Math.min(5 * Math.round(Math.log10(rangeSize)), 30);
}

export function expandRangesInChildSummaries(childSummaries) {
  const { childItems, summaryType } = childSummaries;
  const finalSubpaths = [];
  for (const summaryItem of childItems) {
    if (summaryItem.summary !== null) {
      // this is a valueSummary, and does not need to be split
      finalSubpaths.push(summaryItem);
    } else {
      // summaryItem.path is a RangeDescriptor; may need to be split
      const { min, max } = summaryItem.path;

      const rangeSize = max - min;
      if (rangeSize <= RANGE_SPLIT_THRESHOLD) {
        // range is small, no need to split
        finalSubpaths.push(summaryItem);
      } else {
        // range is big: split it
        const rangeDescriptors = splitIndexRange(
          summaryItem.path,
          targetNumSubRanges(rangeSize)
        );
        // append all the resulting sub-ranges
        for (const rangeSummary of rangeDescriptors) {
          finalSubpaths.push(new ChildSummaryItem(rangeSummary, null));
        }
      }
    }
  }
  return { childItems: finalSubpaths, summaryType };
}

export function getChildSummary(rootObjName, path, compact = true) {
  const pathEnd = path[path.length - 1];
  if (isString(pathEnd)) {
    // if the last item in the path is a string,
    // serialize the object at the end of the path, dropping
    // non-string path elements (which are indexRanges)
    const childSummaries = serializeChildSummary(
      get(window[rootObjName], path.filter(isString))
    );
    if (compact !== true) {
      // in this case, split up long RangeDescriptors
      return expandRangesInChildSummaries(childSummaries);
    }
    return childSummaries;
  }
  // if the end of the path is not a string, it must be an indexRange.
  // Either break it up appropriately, or return the data for that range
  const { min, max } = pathEnd;
  const rangeSize = max - min;
  if (rangeSize > RANGE_SPLIT_THRESHOLD) {
    // if this range is too big, expand into subranges
    const tempChildSummariesForExpansion = expandRangesInChildSummaries(
      new ChildSummary([new ChildSummaryItem(pathEnd, null)]),
      "RANGE_DESCRIPTOR_SUBRANGES"
    );
    return expandRangesInChildSummaries(tempChildSummariesForExpansion);
  }
  // if it's not too big, get the summary for this range
  return {
    childItems: serializeArrayPathsForRange(
      get(window[rootObjName], path.filter(isString)),
      min,
      max
    ),
    summaryType: "ARRAY_PATHS_FOR_RANGE"
  };
}
