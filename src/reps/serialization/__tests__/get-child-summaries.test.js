import {
  newRangeDescriptor,
  newChildSummaryItem,
  newChildSummary,
  isMapPairSummaryItem
} from "../../shared/rep-serialization-core-types";
import {
  getChildSummary,
  expandRangesInChildSummaries
} from "../get-child-summaries";

import { allCases } from "../../__test_helpers__/reps-test-value-cases";

const mockObjSummary = ({
  objType = "Mock",
  size = 1,
  stringValue = "foo",
  isTruncated = false
} = {}) => ({
  objType,
  size,
  stringValue,
  isTruncated
});

function newChildSummaryMock() {
  return newChildSummary(
    new Array(10)
      .fill(0)
      .map((x, i) => newChildSummaryItem(String(i), mockObjSummary()))
  );
}

describe("expandRangesInChildSummaries returns identical childItems if no RangeDescriptors exist", () => {
  const childSummary = newChildSummaryMock();
  const expandedSummary = expandRangesInChildSummaries(childSummary);
  it(`no-op if summary has no RangeDescriptors`, () =>
    expect(childSummary).toEqual(expandedSummary));
});

describe("expandRangesInChildSummaries replaces ranges correctly in all cases", () => {
  [
    newRangeDescriptor(0, 100000),
    newRangeDescriptor(0, 10),
    newRangeDescriptor(90, 100),
    newRangeDescriptor(900, 10000)
  ].forEach(testRange => {
    const childSummary = newChildSummaryMock();
    childSummary[5] = newChildSummaryItem(testRange, null);
    // this test relies on the input validation in the relevant clases
    it(`always returns a valid child summary; ${testRange}`, () =>
      expect(() => newChildSummary(childSummary.childItems)).not.toThrow());
  });
});

describe("getChildSummary base cases (compact summaries)", () => {
  Object.keys(allCases).forEach(testCase => {
    // for each test case, append to window...
    window[testCase] = allCases[testCase];
    const childSummary = getChildSummary("window", [testCase], true);
    // this test relies on the input validation in the relevant clases
    it(`always returns a valid child summary; ${testCase}`, () =>
      expect(() => newChildSummary(childSummary.childItems)).not.toThrow());
  });
});

describe("getChildSummary base cases", () => {
  Object.keys(allCases).forEach(testCase => {
    // for each test case, append to window...
    window[testCase] = allCases[testCase];
    const childSummary = getChildSummary("window", [testCase], false);
    // this test relies on the input validation in the relevant clases
    it(`always returns a valid child summary; ${testCase}`, () =>
      expect(() => newChildSummary(childSummary.childItems)).not.toThrow());
  });
});

/* eslint-disable no-loop-func */
describe("getChildSummary - walking down tree", () => {
  Object.keys(allCases).forEach(testCase => {
    // for each test case, append to window...
    window[testCase] = allCases[testCase];
    const lookupPath = [testCase];
    let childSummary = getChildSummary("window", lookupPath, false);

    for (let depth = 0; depth < 5; depth++) {
      if (childSummary.childItems.length > 0) {
        lookupPath.push(childSummary.childItems[0].path);
        const childItem = childSummary.childItems[0];

        // handle the special case of a Map
        if (isMapPairSummaryItem(childItem)) {
          lookupPath.push("MAP_VAL");
        }

        childSummary = getChildSummary("window", lookupPath, false);
        // this test relies on the input validation in the relevant clases
        it(`always returns a valid child summary; ${testCase}; depth ${depth}`, () =>
          expect(() => newChildSummary(childSummary.childItems)).not.toThrow());
      }
    }
  });
});

describe("getChildSummary - walking down tree - middle subpath", () => {
  // NB: the middle subpath should walk down RangeDescriptors
  Object.keys(allCases).forEach(testCase => {
    // for each test case, append to window...
    window[testCase] = allCases[testCase];
    const lookupPath = [testCase];
    let childSummary = getChildSummary("window", lookupPath, false);

    for (let depth = 0; depth < 5; depth++) {
      if (childSummary.childItems.length > 0) {
        // choose a subpath near the middle; floor in case of only 1 child
        const subpathIndex = Math.floor(childSummary.childItems.length / 2);
        const childItem = childSummary.childItems[subpathIndex];

        lookupPath.push(childItem.path);
        // handle the special case of a Map
        if (isMapPairSummaryItem(childItem)) {
          lookupPath.push("MAP_VAL");
        }

        childSummary = getChildSummary("window", lookupPath, false);

        // this test relies on the input validation in the relevant clases
        it(`always returns a valid child summary; ${testCase}; depth ${depth}`, () =>
          expect(() => newChildSummary(childSummary.childItems)).not.toThrow());
      }
    }
  });
});
