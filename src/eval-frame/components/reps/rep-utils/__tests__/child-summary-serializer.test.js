import { getType } from "../value-summary-serializer";
import {
  numericIndexTypes,
  serializeArrayPathsSummary,
  serializeArrayPathsForRange,
  serializeChildSummary
} from "../child-summary-serializer";
import { isValidChildSumary } from "../is-valid-child-sumary";
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
    // this test relies on error checking in the class constructors
    // when `process.env.NODE_ENV !== "production"`
    it(`serializes correctly in all cases; ${testCase}`, () => {
      expect(serializeChildSummary(allCases[testCase])).not.toThrow();
    });

    // const summary = serializeChildSummary(allCases[testCase]);
  });
});

//   it(`summary is passes isValidChildSumary===true; ${testCase}`, () => {
//     expect(isValidChildSumary(summary)).toBe(true);
//   });

//   it(`summary always has a "childItems" key that is not ===undefined; ${testCase}`, () => {
//     expect(summary.childItems === undefined).toBe(false);
//   });

//   it(`summary.childItems is always an array; ${testCase}`, () => {
//     expect(getType(summary.childItems)).toBe("Array");
//   });

//   it(`summary is always has a "summaryType" key that is a string; ${testCase}`, () => {
//     expect(getType(summary.summaryType) === "String").toBe(true);
//   });

//   it(`each item in summary.childItems is a {path, summary} object; ${testCase}`, () => {
//     summary.childItems.forEach(item => {
//       expect(item.path === undefined).toBe(false);
//       expect(item.summary === undefined).toBe(false);
//     });
//   });

//   summary.childItems.forEach(item => {
//     it(`each item in summary.childItems has "path" that is String|Number|RangeDescriptor; ${testCase}; ${JSON.stringify(
//       item.path
//     )}`, () => {
//       const isString = getType(item.path) === "String";
//       const isRangeDesc =
//         item.path.min !== undefined && item.path.max !== undefined;
//       expect(isString || isRangeDesc).toBe(true);
//     });
//   });

//   summary.childItems.forEach(item => {
//     it(`for each item in summary.childItems, "path" is RangeDescriptor iff summary===null; ${testCase}; ${JSON.stringify(
//       item.path
//     )}`, () => {
//       const pathIsRangeDesc =
//         item.path.min !== undefined && item.path.max !== undefined;
//       const summaryIsNull = item.summary === null;
//       expect(pathIsRangeDesc === summaryIsNull).toBe(true);
//     });
//   });
// });
// });
