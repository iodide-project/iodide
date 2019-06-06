import { RangeDescriptor } from "./rep-serialization-core-types";
import { MAX_SUMMARY_STRING_LEN } from "./value-summary-serializer";

export const RANGE_SPLIT_THRESHOLD = 50;
const TARGET_LEAF_ELTS = 30;

const ln = Math.log;

function targetNumSubRanges(
  rangeSize,
  targetNumSubRangesPerSplit,
  targetLeafBinSize
) {
  // this function gets a target number of subranges for
  // the given
  // (1) the number of elements in the range
  // (2) the number of subranges desired in case of a range split
  // (3) the number of leaf elements to show in a range that will not be split
  // To do this, figure out the integer tree depth that comes closest
  // to satisfying that objective. Then, given that integer depth,
  // return the number of sub ranges that would be needed
  // to build a tree of that depth with the given constraints
  const [N, x, y] = [rangeSize, targetNumSubRangesPerSplit, targetLeafBinSize];
  // NOTE: x**Depth = N/y, therefore:
  const targetSubrangeDepth = Math.round(ln(N / y) / ln(x));
  return targetSubrangeDepth > 0 ? (N / y) ** (1 / targetSubrangeDepth) : N / y;
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
      ? targetNumSubRanges(rangeSize, 20, TARGET_LEAF_ELTS)
      : targetNumSubRanges(rangeSize, 20, MAX_SUMMARY_STRING_LEN);

  let binSize = Math.round(rangeSize / targetNumRanges);
  // these next couple lines are just a bit of footwork to give
  // our bins nice round edges in base 10
  const digits = Math.floor(Math.log10(binSize));
  binSize = Math.round(binSize / 10 ** digits) * 10 ** digits;

  // binSize should not be smaller than minBinSize
  binSize = Math.max(binSize, minBinSize);

  // this is a bit of footwork to set the lower bound of each bin after the first to be a nice round number
  const secondBinMin = Math.ceil(min / binSize) * binSize;
  const ranges =
    min < secondBinMin
      ? [new RangeDescriptor(min, secondBinMin - 1, type)]
      : [];

  // const ranges = [new RangeDescriptor(min, min + binSize - 1, type)];
  let binLowBound;
  for (
    // binLowBound = min + binSize;
    binLowBound = secondBinMin;
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
