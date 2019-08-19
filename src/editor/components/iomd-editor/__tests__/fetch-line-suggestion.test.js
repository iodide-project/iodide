import { fetchLineSuggestion } from "../fetch-line-suggestion";

const nonFileNameSuggestionLabels = [
  "arrayBuffer",
  "blob",
  "css",
  "javascript",
  "js",
  "json",
  "plugin",
  "text"
];

const fileNames = ["foo", "bar", "bat"];

describe("delimLineSuggestion for filenames", () => {
  [
    {
      lineSoFar: "fetchType: varname",
      suggestions: nonFileNameSuggestionLabels
    },
    {
      lineSoFar: "fetchType:",
      suggestions: nonFileNameSuggestionLabels
    },
    {
      lineSoFar: "foo",
      suggestions: nonFileNameSuggestionLabels
    },
    {
      lineSoFar: "fetchType: asdf  fasd fasd =",
      suggestions: nonFileNameSuggestionLabels
    },
    {
      lineSoFar: "fetchType : varName =",
      suggestions: nonFileNameSuggestionLabels
    },

    {
      lineSoFar: "fetchType: varname = ",
      suggestions: fileNames
    },

    {
      lineSoFar: "fetchType:     varname= ",
      suggestions: fileNames
    },
    {
      lineSoFar: "fetchType:     varname   =   ",
      suggestions: fileNames
    }
  ].forEach(({ lineSoFar, suggestions }, i) => {
    const caseSuggestions = fetchLineSuggestion(lineSoFar, fileNames)
      .suggestions;

    it(`Should give set of filenames in filename cases; ${i}, lineSoFar: "${lineSoFar}"`, () => {
      expect(new Set(caseSuggestions.map(s => s.label))).toEqual(
        new Set(suggestions)
      );
    });
  });
});
