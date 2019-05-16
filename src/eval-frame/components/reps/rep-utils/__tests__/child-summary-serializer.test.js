import { getType } from "../value-summary-serializer";
import {
  numericIndexTypes,
  serializeArrayPathsSummary,
  serializeChildSummary
} from "../child-summary-serializer";
import { allCases } from "../../__test_helpers__/reps-test-value-cases";

describe("serializeArrayPathsSummary", () => {
  const arrayCases = Object.keys(allCases).filter(k =>
    numericIndexTypes.includes(getType(allCases[k]))
  );

  arrayCases.forEach(testCase => {
    const summary = serializeArrayPathsSummary(allCases[testCase]);
    it(`always returns an array; ${testCase}`, () =>
      expect(getType(summary)).toBe("Array"));

    // it(`always returns an array length > 0; ${testCase}`, () =>
    //   expect(summary.length > 0).toBe(true));
  });
});

describe("serializeChildSummary", () => {
  Object.keys(allCases).forEach(testCase => {
    const summary = serializeChildSummary(allCases[testCase]);
    it(`summary is always has a "subpaths" key that is not ===undefined; ${testCase}`, () => {
      expect(summary.subpaths === undefined).toBe(false);
    });
    it(`summary.subpaths is always an array; ${testCase}`, () => {
      expect(getType(summary.subpaths)).toBe("Array");
    });
    it(`summary is always has a "summaryType" key that is a string; ${testCase}`, () => {
      expect(getType(summary.summaryType) === "String").toBe(true);
    });

    it(`each item in summary.subpaths is a {path, summary} object; ${testCase}`, () => {
      summary.subpaths.forEach(item => {
        expect(item.path === undefined).toBe(false);
        expect(item.summary === undefined).toBe(false);
      });
    });

    summary.subpaths.forEach(item => {
      it(`each item in summary.subpaths has "path" of Null|String|Number; ${testCase}; ${JSON.stringify(
        item.path
      )}`, () => {
        expect(["String", "Null", "Number"].includes(getType(item.path))).toBe(
          true
        );
      });
    });
  });
});
