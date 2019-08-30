import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { makeSuggestionList } from "./make-suggestion-list";

const { Keyword } = monaco.languages.CompletionItemKind;

// FIXME validChunkFlags should probably move to state eventually, since
// we've discussed allowing plugins to define flags that might only
// be available at run time. but for now, we can just hardcode this here.
export const validChunkFlags = ["skipRunAll"];

export const delimLineSuggestion = (lineSoFar, knownChunkTypes, lineNumber) => {
  let suggestions;
  if (lineSoFar.match("^%+$")) {
    // if the lineSoFar is just a bunch of "%" signs, replace the start of the
    // line with that number of pcts (at least 2) and known chunk types
    const numPctSigns = Math.max(lineSoFar.length, 2);
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
