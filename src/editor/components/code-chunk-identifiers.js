import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { makeSuggestionList } from "./make-suggestion-list";

const { Text } = monaco.languages.CompletionItemKind;

export function codeChunkIdentifiers(codeChunkContents) {
  // FIXME: this function is super inefficient.
  // If we move this to the store or a language worker,
  // we can more intelligently manage the list of words incrementally
  // rather than rebuilding each time. Or ideally, we can tap into an existing tokenizer
  const identifiersRE = /[_$a-zA-Z][_$a-zA-Z0-9α]*/g;
  const identifierSet = new Set();
  for (const chunkContent of codeChunkContents) {
    let result = identifiersRE.exec(chunkContent);
    while (result) {
      identifierSet.add(result[0]);
      result = identifiersRE.exec(chunkContent);
    }
  }
  return { suggestions: makeSuggestionList([...identifierSet], Text) };
}
