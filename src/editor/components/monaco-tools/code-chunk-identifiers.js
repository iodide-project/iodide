import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { makeSuggestionList } from "./make-suggestion-list";

const { Text } = monaco.languages.CompletionItemKind;

function getChunksIdentifiersWithRegex(chunkContents, regex) {
  // FIXME: this implementation is not terribly clever or efficient.
  // If we move this to the store or a language worker, perhaps
  // we can more intelligently manage the list of words incrementally
  // rather than rebuilding each time. Or ideally, we can use an existing tokenizer
  const identifierSet = new Set();
  for (const chunkContent of chunkContents) {
    let result = regex.exec(chunkContent);
    while (result) {
      identifierSet.add(result[1]);
      result = regex.exec(chunkContent);
    }
  }
  return identifierSet;
}

const fetchIdentifierRegex = /^\w+: (\w+) *= */gm;
const cssIdentifierRegex = /[.|#]([_$a-zA-Z-][_$a-zA-Z0-9-]*)/g;
const codeIdentifierRegex = /([_$a-zA-Z][_$a-zA-Z0-9]*)/g;

export const fetchIdentifiers = chunkContents =>
  getChunksIdentifiersWithRegex(chunkContents, fetchIdentifierRegex);

export const cssIdentifiers = chunkContents =>
  getChunksIdentifiersWithRegex(chunkContents, cssIdentifierRegex);

export const codeIdentifiers = chunkContents =>
  getChunksIdentifiersWithRegex(chunkContents, codeIdentifierRegex);

export function codeChunkIdentifiers(chunks, activeLanguages) {
  const fetchVarnames = fetchIdentifiers(
    chunks.filter(c => c.chunkType === "fetch").map(c => c.chunkContent)
  );
  const cssVarnames = cssIdentifiers(
    chunks.filter(c => c.chunkType === "css").map(c => c.chunkContent)
  );
  const codeVarnames = codeIdentifiers(
    chunks
      .filter(c => activeLanguages.includes(c.chunkType))
      .map(c => c.chunkContent)
  );

  cssVarnames.forEach(v => fetchVarnames.add(v));
  codeVarnames.forEach(v => fetchVarnames.add(v));

  return {
    suggestions: makeSuggestionList([...fetchVarnames], Text)
  };
}
