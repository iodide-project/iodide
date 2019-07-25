import { getType } from "../value-summary-serializer";
import {
  serializeArrayPathsSummary,
  serializeArrayPathsForRange,
  serializeChildSummary
} from "../child-summary-serializer";
import { numericIndexTypes } from "../../shared/type-categories";
import { allCases } from "../../__test_helpers__/reps-test-value-cases";

describe("serializeArrayPathsSummary", () => {
  const arrayCases = Object.keys(allCases).filter(k =>
    numericIndexTypes.includes(getType(allCases[k]))
  );

  arrayCases.forEach(testCase => {
    const summaryArray = serializeArrayPathsSummary(allCases[testCase]);
    it(`always returns an array; ${testCase}`, () =>
      expect(getType(summaryArray)).toBe("Array"));

    it(`each item in summaryArray is a {path, summary} object; ${testCase}`, () => {
      summaryArray.forEach(item => {
        expect(item.path === undefined).toBe(false);
        expect(item.summary === undefined).toBe(false);
      });
    });
  });
});

describe("serializeArrayPathsForRange", () => {
  const arrayCases = Object.keys(allCases).filter(k =>
    numericIndexTypes.includes(getType(allCases[k]))
  );

  arrayCases.forEach(testCase => {
    [
      { min: 0, max: Math.ceil(testCase.length / 2) },
      { min: Math.floor(testCase.length / 2), max: testCase.length }
    ].forEach(({ min, max }) => {
      const summaryArray = serializeArrayPathsForRange(
        allCases[testCase],
        min,
        max
      );

      it(`always returns an array; ${testCase}; min:${min}, max:${max}`, () =>
        expect(getType(summaryArray)).toBe("Array"));

      it(`each item in summaryArray is a {path, summary} object; ${testCase}; min:${min}, max:${max}`, () => {
        summaryArray.forEach(item => {
          expect(item.path === undefined).toBe(false);
          expect(item.summary === undefined).toBe(false);
        });
      });

      it(`each valueSummaries are never "null", which would indicate a RangeDescriptor; ${testCase}; min:${min}, max:${max}`, () => {
        summaryArray.forEach(item => {
          expect(item.summary === null).toBe(false);
        });
      });
    });
  });
});

describe("serializeChildSummary", () => {
  Object.keys(allCases).forEach(testCase => {
    // this test relies on validation in the class constructors
    // when `process.env.NODE_ENV !== "production"`
    it(`serializes a valid childSummary in all cases; ${testCase}`, () => {
      expect(() => serializeChildSummary(allCases[testCase])).not.toThrow();
    });
  });
});
