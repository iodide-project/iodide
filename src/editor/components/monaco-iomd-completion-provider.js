// FIXME importing store directly has proven to be an antipattern
// should use a higher-order fucntion or something
import { store } from "../store";
import { getChunkContainingLine } from "../iomd-tools/iomd-selection";

import {
  NONCODE_EVAL_TYPES,
  RUNNABLE_CHUNK_TYPES
} from "../state-schemas/state-schema";
import { fetchLineSuggestion } from "./fetch-line-suggestion";
import { delimLineSuggestion } from "./delim-line-suggestion";
import { codeChunkIdentifiers } from "./code-chunk-identifiers";

export const iomdCompletionProvider = {
  triggerCharacters: ["%"],
  provideCompletionItems: (model, position) => {
    const { iomdChunks, languageDefinitions, notebookInfo } = store.getState();
    const currentChunk = getChunkContainingLine(
      iomdChunks,
      position.lineNumber
    );

    const lineSoFar = model.getValueInRange({
      startLineNumber: position.lineNumber,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column
    });

    const completionType =
      currentChunk.startLine === position.lineNumber || lineSoFar === "%"
        ? "delimLine"
        : currentChunk.chunkType;
    switch (completionType) {
      case "delimLine": {
        const knownChunkTypes = Object.keys(languageDefinitions)
          .concat(NONCODE_EVAL_TYPES)
          .concat(RUNNABLE_CHUNK_TYPES);
        return delimLineSuggestion(
          lineSoFar,
          knownChunkTypes,
          position.lineNumber
        );
      }
      case "fetch": {
        const fileNames = notebookInfo.files.map(f => f.filename);
        return fetchLineSuggestion(lineSoFar, fileNames);
      }
      case "md": {
        return {};
      }
      default: {
        // FIXME: this should not be hardcoded here, but this concept of
        // code-like chunk types that might share identifers does not fit
        // any existing concept
        const codeLikeChunkTypes = Object.keys(languageDefinitions).concat([
          "css",
          "fetch"
        ]);
        return codeChunkIdentifiers(
          iomdChunks
            .filter(c => codeLikeChunkTypes.includes(c.chunkType))
            .map(c => c.chunkContent)
        );
      }
    }
  }
};
