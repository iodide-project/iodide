import {
  newValueSummary,
  newRangeDescriptor,
  newChildSummary,
  newChildSummaryItem
} from "../rep-serialization-core-types";

function replaceArg(args, index, newArg) {
  const argsOut = [...args];
  argsOut[index] = newArg;
  return argsOut;
}

describe("ValueSummary", () => {
  const okArgs = ["string1", 6453, "string2", true, true];
  it(`should not throw in case of valid construction arg`, () => {
    expect(() => newValueSummary(...okArgs)).not.toThrow();
  });

  [
    replaceArg(okArgs, 0, 531),
    replaceArg(okArgs, 1, "not number"),
    replaceArg(okArgs, 2, 531),
    replaceArg(okArgs, 3, "not bools"),
    replaceArg(okArgs, 4, "not bools")
  ].forEach((args, i) => {
    it(`should throw in case of invalid construction-- case ${i}, args: ${args}`, () => {
      expect(() => newValueSummary(...args)).toThrow();
    });
  });
});

describe("RangeDescriptor", () => {
  const okArgs = [34, 6453, "a string"];
  it(`should not throw in case of valid construction arg`, () => {
    expect(() => newRangeDescriptor(...okArgs)).not.toThrow();
  });

  [
    replaceArg(okArgs, 0, "str"),
    replaceArg(okArgs, 1, "str"),
    replaceArg(okArgs, 2, 531),
    [543, 1, "str"],
    [-1, 1, "str"],
    [0, Infinity, "str"],
    [-Infinity, 100, "str"],
    [10, NaN, "str"]
  ].forEach((args, i) => {
    it(`should throw in case of invalid construction-- case ${i}, args: ${args}`, () => {
      expect(() => newRangeDescriptor(...args)).toThrow();
    });
  });
});

const okValueSummary = newValueSummary("string1", 6453, "string2", true, true);
const okChildSummaryItem = () => newChildSummaryItem("path", okValueSummary);

describe("ChildSummary", () => {
  const okArgs = [
    [okChildSummaryItem(), okChildSummaryItem(), okChildSummaryItem()]
  ];
  it(`should not throw in case of valid construction arg`, () => {
    expect(() => newChildSummary(...okArgs)).not.toThrow();
  });

  [
    replaceArg(okArgs, 0, "not an array"),
    replaceArg(okArgs, 0, [{ path: "asdf", summary: null }])
  ].forEach((args, i) => {
    it(`should throw in case of invalid construction-- case ${i}, args: ${args}`, () => {
      expect(() => newChildSummary(...args)).toThrow();
    });
  });
});
