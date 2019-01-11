import _ from "lodash";
import nb from "../nb";

describe("nb.isRowDf", () => {
  it("accepts the following values", () => {
    expect(nb.isRowDf(undefined)).toBe(false);
    expect(nb.isRowDf([])).toBe(false);
    expect(nb.isRowDf(["x", "y"])).toBe(false);
    expect(nb.isRowDf([[1, 2, 3, 4], [1, 2, 3, 4]])).toBe(false);
    expect(nb.isRowDf({})).toBe(false);

    expect(nb.isRowDf([{ a: 10, b: 20 }])).toBe(true);
    expect(nb.isRowDf([{ a: 10 }, { a: 20 }])).toBe(true);
    expect(nb.isRowDf([{}])).toBe(true);
  });
  it("rejects the following values", () => {
    expect(nb.isRowDf(undefined)).toBe(false);
    expect(nb.isRowDf(null)).toBe(false);
    expect(nb.isRowDf([undefined])).toBe(false);
    expect(nb.isRowDf(["test"])).toBe(false);
    expect(nb.isRowDf([new Date()])).toBe(false);
    expect(nb.isRowDf({})).toBe(false);
    expect(nb.isRowDf([])).toBe(false);
    expect(nb.isRowDf([1, 2, 3, 4])).toBe(false);
  });
});

describe("nb.isColumnDf", () => {
  expect(nb.isColumnDf(undefined)).toBe(false);
  expect(nb.isColumnDf({})).toBe(false);
  expect(nb.isColumnDf([])).toBe(false);
  expect(
    nb.isColumnDf({
      something: [1, 2, 3, 4, 5],
      somethingElse: [4, 5, 6, 7, 8]
    })
  ).toBe(true);
  expect(nb.isColumnDf({ something: [], somethingElse: [] })).toBe(true);
  expect(nb.isColumnDf({ something: "ok", somethingElse: [] })).toBe(false);
  expect(nb.isColumnDf({ something: [1, 2], somethingElse: "ok" })).toBe(false);
});

describe("nb.shape", () => {
  expect(nb.shape([1, 2, 3, 4])).toEqual([undefined, undefined]);
  expect(nb.shape("hello")).toEqual([undefined, undefined]);
  expect(nb.shape([[1], [1]])).toEqual([2, 1]);
  expect(nb.shape([[1, 1]])).toEqual([1, 2]);
  expect(nb.shape([[1, 1, 1, 1, 1, 1]])).toEqual([1, 6]);
  expect(nb.shape([[1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]])).toEqual([2, 6]);
  expect(nb.shape({ col1: [1, 2, 3, 4, 5], col2: [1, 2, 3, 4, 5] })).toEqual([
    5,
    2
  ]);
  expect(nb.shape({})).toEqual([undefined, undefined]);
  expect(
    nb.shape([{ a: 10, b: 20 }, { a: 20, b: 30 }, { a: 20, b: 30 }])
  ).toEqual([3, 2]);
  expect(nb.shape([{}])).toEqual([1, 0]);
  expect(nb.shape([{}, { a: 10, b: 20 }])).toEqual([undefined, undefined]); // is this right??
});

describe("nb.isSimpleArray", () => {
  expect(nb.isSimpleArray([1, 2, 3])).toBe(true);
  const notSimple = [1, 2, 3];
  notSimple.foo = "notSimple";
  expect(nb.isSimpleArray(notSimple)).toBe(false);
});

describe("nb.isMatrixLike", () => {
  it("accepts the following values", () => {
    expect(nb.isMatrixLike([[1, 2, 3], [4, 5, 6]])).toBe(true);
    expect(nb.isMatrixLike([[1, 2, "asdf"], [4, 5, 6]])).toBe(true);
    expect(nb.isMatrixLike(_.range(10).map(() => _.range(10)))).toBe(true);
    expect(nb.isMatrixLike([[1, 2, 3], [4, undefined, 6]])).toBe(true);
  });
  it("rejects if arrays have extra props", () => {
    const testObj1 = _.range(10).map(() => _.range(10));
    testObj1.foo = "extra";
    expect(nb.isMatrixLike(testObj1)).toBe(false);

    const testObj2 = _.range(10).map(() => {
      const row = _.range(10);
      row.foo = "extra";
      return row;
    });
    expect(nb.isMatrixLike(testObj2)).toBe(false);
  });
  it("rejects the following values", () => {
    expect(nb.isMatrixLike([[], []])).toBe(false);
    expect(nb.isMatrixLike([[1, 2, 3], [4, 6]])).toBe(false);
    expect(nb.isMatrixLike([[1, 2, 3], []])).toBe(false);
    expect(nb.isMatrixLike([[1, 2, 3], [[], 5, 6]])).toBe(true);
    expect(nb.isMatrixLike([[[1], [2], [3]], [[4], [5], [6]]])).toBe(true);
    expect(nb.isMatrixLike([[1, 2, 3], [{ a: "value" }, 5, 6]])).toBe(true);
    expect(nb.isMatrixLike([[[[]]]])).toBe(true);
    expect(nb.isMatrixLike({})).toBe(false);
    expect(nb.isMatrixLike(undefined)).toBe(false);
    expect(nb.isMatrixLike([{ a: 10 }, { b: 20 }])).toBe(false);
  });
  it("rejects the following values", () => {
    expect(nb.isMatrixLike({})).toBe(false);
    expect(nb.isMatrixLike(undefined)).toBe(false);
    expect(nb.isMatrixLike([{ a: 10 }, { b: 20 }])).toBe(false);
  });
});

describe("nb.prettyFormatNumber", () => {
  const dt = new Date();
  // passthroughs
  expect(nb.prettyFormatNumber("test")).toBe("test");
  expect(nb.prettyFormatNumber({})).toEqual({});
  expect(nb.prettyFormatNumber(dt)).toEqual(dt);
  // numerical conversions
  expect(nb.prettyFormatNumber(1e11)).toBe("1.0000e+11");
  expect(nb.prettyFormatNumber(1e1)).toBe("10");
  expect(nb.prettyFormatNumber(1e2)).toBe("100");
  expect(nb.prettyFormatNumber(1e3)).toBe("1000");
  expect(nb.prettyFormatNumber(1e4)).toBe("10000");
  expect(nb.prettyFormatNumber(1e5)).toBe("100000");
  expect(nb.prettyFormatNumber(1e9)).toBe("1.0000e+9");
  expect(nb.prettyFormatNumber(1e11)).toBe("1.0000e+11");
  const num = 123456789.123456789;
  expect(nb.prettyFormatNumber(num)).toBe("1.2346e+8");
  expect(nb.prettyFormatNumber(-num)).toBe("-1.2346e+8");
  expect(nb.prettyFormatNumber(num / 1e1)).toBe("1.2346e+7");
  expect(nb.prettyFormatNumber(num / 1e2)).toBe("1234568");
  expect(nb.prettyFormatNumber(num / 1e8)).toBe("1.23457");
  expect(nb.prettyFormatNumber(num / 1e9)).toBe("0.123457");
  expect(nb.prettyFormatNumber(num / 1e12)).toBe("0.000123");
  expect(nb.prettyFormatNumber(num / 1e15)).toBe("0.00000"); // does this seem right?
  expect(nb.prettyFormatNumber(-num / 1e12)).toBe("-0.000123");
});

describe("nb.shape", () => {});
