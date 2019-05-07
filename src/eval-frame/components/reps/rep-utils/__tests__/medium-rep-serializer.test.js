import { getType } from "../tiny-rep-serializer";
import {
  numericIndexTypes,
  serializeArrayPathsSummary
} from "../medium-rep-serializer";
import { allCases } from "../../__test_helpers__/reps-test-value-cases";

describe("serializeArrayPathsSummary", () => {
  const arrayCases = Object.keys(allCases).filter(k =>
    numericIndexTypes.includes(getType(allCases[k]))
  );

  arrayCases.forEach(testCase => {
    const testSummary = serializeArrayPathsSummary(allCases[testCase]);
    it(`always returns an array; ${testCase}`, () =>
      expect(getType(testSummary)).toBe("Array"));

    // it(`always returns an array length > 0; ${testCase}`, () =>
    //   expect(testSummary.length > 0).toBe(true));
  });
});
