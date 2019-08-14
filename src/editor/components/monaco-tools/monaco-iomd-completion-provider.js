import { store } from "../../store";
import { getChunkContainingLine } from "../../iomd-tools/iomd-selection";

import {
  NONCODE_EVAL_TYPES,
  RUNNABLE_CHUNK_TYPES
} from "../../state-schemas/state-schema";
import { fetchLineSuggestion } from "./fetch-line-suggestion";
import { delimLineSuggestion } from "./delim-line-suggestion";
import { codeChunkIdentifiers } from "./code-chunk-identifiers";

export function makeIomdCompletionProvider(getState) {
  return {
    triggerCharacters: ["%"],
    provideCompletionItems: (model, position) => {
      const { iomdChunks, languageDefinitions, notebookInfo } = getState();
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
          return codeChunkIdentifiers(
            iomdChunks,
            Object.keys(languageDefinitions)
          );
        }
      }
    }
  };
}

export const iomdCompletionProvider = makeIomdCompletionProvider(
  store.getState
);
