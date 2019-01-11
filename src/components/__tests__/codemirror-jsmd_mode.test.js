import { delimLineRegex } from "../codemirror-jsmd-mode";

describe("delimLineRegex returns expected match", () => {
  const linesAndResults = [
    ["%%", ""],
    ["%%     ", ""],

    ["%%      js", "js"],
    ["%%js", "js"],
    ["%% js", "js"],
    ["%%      js   foo bar    bat", "js"],
    ["%%js   foo bar    bat", "js"],
    ["%% js   foo bar    bat", "js"]
  ];
  linesAndResults.forEach(l => {
    const [line, result] = l;
    it(`case: \`${line}\``, () => {
      expect(delimLineRegex.exec(line)[1]).toEqual(result);
    });
  });
});

describe("delimLineRegex returns expected non-match", () => {
  const linesAndResults = [
    ["%", null],
    ["%    ", null],
    ["% %   ", null],
    ["%   %%      js", null]
  ];
  linesAndResults.forEach(l => {
    const [line, result] = l;
    it(`case: \`${line}\``, () => {
      expect(delimLineRegex.exec(line)).toEqual(result);
    });
  });
});
