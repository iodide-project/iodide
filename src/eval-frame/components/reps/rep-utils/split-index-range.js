import { RangeDescriptor } from "./rep-serialization-core-types";

const DEFAULT_NUM_RANGE_BINS = 10;

export function splitIndexRange(
  rangeDescriptor,
  targetNumRanges = DEFAULT_NUM_RANGE_BINS,
  minBinSize = 10
) {
  const { min, max, type } = rangeDescriptor;
  let binSize = Math.round((max - min) / targetNumRanges);

  // these next couple lines are just a bit of footwork to give
  // our bins nice round edges
  const digits = Math.floor(Math.log10(binSize));
  binSize = Math.round(binSize / 10 ** digits) * 10 ** digits;

  // binSize should not be smaller than minBinSize
  binSize = Math.max(binSize, minBinSize);

  const ranges = [new RangeDescriptor(min, binSize - 1, type)];
  let binLowBound;
  for (
    binLowBound = binSize;
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
