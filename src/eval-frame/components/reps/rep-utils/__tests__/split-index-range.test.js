import { splitIndexRange } from "../split-index-range";
import { RangeDescriptor } from "../rep-serialization-core-types";

describe("split ranges correctly", () => {
  it("the max of each range is one less than min of the next", () => {
    const ranges = splitIndexRange(new RangeDescriptor(0, 100), 10);
    for (let i = 1; i < ranges.length; i++) {
      expect(ranges[i].min).toBe(ranges[i - 1].max + 1);
    }
  });

  it("the first min and the last max are correct", () => {
    const MIN = 422;
    const MAX = 34742;
    const ranges = splitIndexRange(new RangeDescriptor(MIN, MAX), 10);
    expect(ranges[0].min).toBe(MIN);
    expect(ranges[ranges.length - 1].max).toBe(MAX);
  });
});

describe("split ranges correctly in seeming error cases", () => {
  [
    {
      range: new RangeDescriptor(5, 9994, "ARRAY_RANGE"),
      targetNumRanges: 10
    },
    {
      range: new RangeDescriptor(5, 9994, "ARRAY_RANGE"),
      targetNumRanges: 20
    }
  ].forEach(({ range, targetNumRanges }) => {
    it("the max of each range is one less than min of the next", () => {
      const ranges = splitIndexRange(range, targetNumRanges);
      for (let i = 1; i < ranges.length; i++) {
        expect(ranges[i].min).toBe(ranges[i - 1].max + 1);
      }
    });
  });
});
