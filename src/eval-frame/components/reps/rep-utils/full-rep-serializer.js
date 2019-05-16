import { range } from "lodash";

// function getFullRepPaths(obj) {}

// function serializeObjectPathsSummary(obj, previewNum = 5) {
//   const summary = [];
//   let i = 0;
//   // note: intionally using for-in because we
//   // DO want properties from the prototype chain
//   for (const key of Object.getOwnPropertyNames(obj)) {
//     summary.push({
//       key: serializePropertyLabel(key),
//       value: serializeForMediumRep(obj[key])
//     });
//     i += 1;
//   }
//   return summary;
// }

// [0,1,2,3,4,{5,999}, {1000,1999}, {2000,2999}, ..., {9000,9994}, 9995,9996,9997,9998,9999]

function splitIndexRange(minIndex, maxIndex, targetNumRanges, minBinSize) {
  // note: we always intentionally omit the first few indices from the first bin
  let binSize = Math.round(maxIndex / targetNumRanges);
  // these next couple lines are just a bit of footwork to give
  // our bins nice round edges
  const digits = Math.floor(Math.log10(binSize));
  binSize = Math.round(binSize / 10 ** digits) * 10 ** digits;
  binSize = Math.max(binSize, minBinSize);

  const ranges = [{ min: minIndex, max: binSize - 1 }];
  let binLowBound;
  for (
    binLowBound = binSize;
    binLowBound + binSize < maxIndex;
    binLowBound += binSize
  ) {
    ranges.push({ min: binLowBound, max: binLowBound + binSize - 1 });
  }
  ranges.push({ min: binLowBound, max: maxIndex });
  return ranges;
}

const TOP_LEVEL_MAX_ARRAY_RANGES = 10;
export function arrayPaths(
  arr,
  maxLength = 50,
  headPreview = 5,
  tailPreview = 5,
  targetNumRanges = TOP_LEVEL_MAX_ARRAY_RANGES
) {
  if (arr.length === 0) {
    return [];
  }

  // can't use a plain Array.map in this fnc this b/c it doesn't work with typed arrays
  if (arr.length <= maxLength) {
    return range(arr.length);
  }

  return [
    ...range(headPreview),
    ...serializeRanges(
      headPreview + 1,
      arr.length - tailPreview - 1,
      targetNumRanges
    ),
    ...range(arr.length - tailPreview, arr.length)
  ];
}
