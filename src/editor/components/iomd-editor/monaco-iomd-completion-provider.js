import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { store } from "../../store";
import { getChunkContainingLine } from "../../iomd-tools/iomd-selection";

import {
  NONCODE_EVAL_TYPES,
  RUNNABLE_CHUNK_TYPES
} from "../../state-schemas/state-schema";
import { fetchLineSuggestion } from "./fetch-line-suggestion";
import { delimLineSuggestion } from "./delim-line-suggestion";
import { codeChunkIdentifiers } from "./code-chunk-identifiers";
import { makeSuggestionList } from "./make-suggestion-list";
import { getCompletionScope } from "./parse-js-completion-scope";
import messagePasserEditor from "../../../shared/utils/redux-to-port-message-passer";

const { Field } = monaco.languages.CompletionItemKind;

export function makeIomdCompletionProvider(getState) {
  return {
    triggerCharacters: ["%"],
    provideCompletionItems: async (model, position) => {
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

        case "js": {
          const chunkSoFar = model.getValueInRange({
            startLineNumber: currentChunk.startLine + 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          });
          const path = getCompletionScope(chunkSoFar);
          if (!path) return {};

          const completions = await messagePasserEditor.postMessageAndAwaitResponse(
            "CODE_COMPLETION_REQUEST",
            { language: "js", path }
          );
          return { suggestions: makeSuggestionList(completions, Field) };
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
