import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { makeSuggestionList } from "./make-suggestion-list";

const { Keyword } = monaco.languages.CompletionItemKind;

// FIXME validChunkFlags should probably move to state eventually, since
// we've discussed allowing plugins to define flags that might only
// be available at run time. but for now, we can just hardcode this here.
export const validChunkFlags = ["skipRunAll"];

export const delimLineSuggestion = (lineSoFar, knownChunkTypes, lineNumber) => {
  let suggestions;
  if (lineSoFar === "%") {
    // if the line is just "%", suggestions should replace the start of the
    // line with the "%%" and known chunk types
    suggestions = makeSuggestionList(
      knownChunkTypes.map(ct => `%% ${ct}`),
      Keyword,
      { range: new monaco.Range(lineNumber, 1, lineNumber, 2) }
    );
  } else if (lineSoFar.match("^%%+$")) {
    // if the line is just a bunch of "%" signs, replace the start of the
    // line with that number of pcts and known chunk types
    const numPctSigns = lineSoFar.length;
    suggestions = makeSuggestionList(
      knownChunkTypes.map(ct => `${"%".repeat(numPctSigns)} ${ct}`),
      Keyword,
      { range: new monaco.Range(lineNumber, 1, lineNumber, numPctSigns) }
    );
  } else if (lineSoFar.match(new RegExp(knownChunkTypes.join("|")))) {
    // if the delimLine already includes a valid chunk type
    // then return the valid chunkflags as suggestions
    suggestions = makeSuggestionList(validChunkFlags, Keyword);
  } else {
    // otherwise, suggest a chunk types without a prefix
    suggestions = makeSuggestionList(knownChunkTypes, Keyword);
  }
  return { suggestions };
};
