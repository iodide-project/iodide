import { RangeDescriptor } from "./rep-serialization-core-types";

export const RANGE_SPLIT_THRESHOLD = 50;
export const MAX_NUM_SUBRANGES = 30;

function targetNumSubRanges(rangeSize) {
  // number of ranges should be min 5 (in the case of a bin with 50 elts)
  // and max 30 for huge ranges (so as to not overwhelm the screen)
  return Math.min(Math.round(5 * Math.log10(rangeSize)), MAX_NUM_SUBRANGES);
}

function targetNumStringSubRanges(rangeSize) {
  return 10; // for now
}

export function splitIndexRange(
  rangeDescriptor,
  minBinSize = 10,
  rangeSplitThreshold = RANGE_SPLIT_THRESHOLD
) {
  const { min, max, type } = rangeDescriptor;

  const rangeSize = max - min;

  // no need to split bins smaller than a certain size
  if (rangeSize <= rangeSplitThreshold || rangeSize <= minBinSize)
    return [rangeDescriptor];

  const targetNumRanges =
    type !== "STRING_RANGE"
      ? targetNumSubRanges(rangeSize)
      : targetNumStringSubRanges(rangeSize);

  let binSize = Math.round(rangeSize / targetNumRanges);
  // these next couple lines are just a bit of footwork to give
  // our bins nice round edges
  const digits = Math.floor(Math.log10(binSize));
  binSize = Math.round(binSize / 10 ** digits) * 10 ** digits;

  // binSize should not be smaller than minBinSize
  binSize = Math.max(binSize, minBinSize);

  // this is a bit of footwork to set the lower bound of each bin after the first to be a nice round number
  // const firstBinMax = Math.ceil(min/binSize)*binSize

  const ranges = [new RangeDescriptor(min, min + binSize - 1, type)];
  let binLowBound;
  for (
    binLowBound = min + binSize;
    binLowBound + binSize < max;
    binLowBound += binSize
  ) {
    ranges.push(
      new RangeDescriptor(binLowBound, binLowBound + binSize - 1, type)
    );
  }
  ranges.push(new RangeDescriptor(binLowBound, max, type));

  return ranges;
}
