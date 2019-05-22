import {
  getClass,
  // MAX_TINY_STRING_LEN,
  getType,
  // tinyRepStringify,
  objSize
} from "../value-summary-serializer";
import { allCases } from "../../__test_helpers__/reps-test-value-cases";

function returnsStringForAllTestValues(testFn) {
  describe(`tiny-rep-serializer function "${testFn.name}" returns a string for all test values`, () => {
    Object.keys(allCases).forEach(testCase => {
      it(`${testFn.name} should return a string; case: ${testCase}`, () =>
        expect(typeof testFn(allCases[testCase])).toBe("string"));
    });
  });
}

returnsStringForAllTestValues(getClass);
returnsStringForAllTestValues(getType);

// describe("tinyRepStringify always returns an array with a short string and a bool", () => {
//   Object.keys(allCases).forEach(testCase => {
//     it(`tinyRepStringify(...)[0] should be a string; case: ${testCase}`, () =>
//       expect(typeof tinyRepStringify(allCases[testCase])[0]).toBe("string"));

//     it(`tinyRepStringify(...)[0] should return a string shorter than ${MAX_TINY_STRING_LEN} chars; case: ${testCase}`, () =>
//       expect(
//         tinyRepStringify(allCases[testCase])[0].length <= MAX_TINY_STRING_LEN
//       ).toBe(true));

//     it(`tinyRepStringify(...)[1] should be a boolean chars; case: ${testCase}`, () =>
//       expect(typeof tinyRepStringify(allCases[testCase])[1]).toBe("boolean"));
//   });
// });

describe("objSize(x) returns a number if x not nulland not undefined", () => {
  Object.keys(allCases).forEach(testCase => {
    const testValue = allCases[testCase];
    if (testValue === null || testValue === undefined) {
      it(`objSize should be null; case: ${testCase}`, () =>
        expect(objSize(testValue)).toBe(null));
    } else {
      it(`objSize should be a number; case: ${testCase}`, () =>
        expect(typeof objSize(testValue)).toBe("number"));
    }
  });
});
