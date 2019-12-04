import { delimLineSuggestion } from "../delim-line-suggestion";

const knownChunkTypes = ["js", "md", "foo"];
const lineNumber = 10; // arbitrary, not testing range replacement details

describe("delimLineSuggestion", () => {
  [
    {
      lineSoFar: "%",
      suggestions: ["%%", "%% js", "%% md", "%% foo"],
      hasReplaceRange: true
    },
    {
      lineSoFar: "%%",
      suggestions: ["%%", "%% js", "%% md", "%% foo"],
      hasReplaceRange: true
    },
    {
      lineSoFar: "%j",
      suggestions: ["%%", "%% js", "%% md", "%% foo"],
      hasReplaceRange: true
    },
    {
      lineSoFar: "%%j",
      suggestions: ["%%", "%% js", "%% md", "%% foo"],
      hasReplaceRange: true
    },
    {
      lineSoFar: "%%%%%",
      suggestions: ["%%%%%", "%%%%% js", "%%%%% md", "%%%%% foo"],
      hasReplaceRange: true
    },
    {
      lineSoFar: "%%%%%o",
      suggestions: ["%%%%%", "%%%%% js", "%%%%% md", "%%%%% foo"],
      hasReplaceRange: true
    },
    {
      lineSoFar: "%% js",
      suggestions: ["skipRunAll"],
      hasReplaceRange: false
    },
    {
      lineSoFar: "%% ",
      suggestions: knownChunkTypes,
      hasReplaceRange: false
    },
    {
      lineSoFar: "%%%%%% ",
      suggestions: knownChunkTypes,
      hasReplaceRange: false
    },
    {
      lineSoFar: "%%%%%%    ",
      suggestions: knownChunkTypes,
      hasReplaceRange: false
    },
    {
      lineSoFar: "%%    j",
      suggestions: knownChunkTypes,
      hasReplaceRange: false
    }
  ].forEach(({ lineSoFar, suggestions, hasReplaceRange }, i) => {
    const caseSuggestions = delimLineSuggestion(
      lineSoFar,
      knownChunkTypes,
      lineNumber
    ).suggestions;
    it(`Should give correct labels for case ${i}, lineSoFar: ${lineSoFar}`, () => {
      expect(caseSuggestions.map(s => s.label)).toEqual(suggestions);
    });

    it(`Should correctly have / not have range for case ${i}, lineSoFar: ${lineSoFar}`, () => {
      const hasRangeArray = caseSuggestions.map(s => s.range !== undefined);
      hasRangeArray.reduce((x, y) => x && y, true);
      expect(hasRangeArray.reduce((x, y) => x && y, true)).toEqual(
        hasReplaceRange
      );
    });
  });
});
