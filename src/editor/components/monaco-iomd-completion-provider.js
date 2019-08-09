import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

// FIXME importing store directly has proven to be an antipattern
// should use a higher-order fucntion or something
import { store } from "../store";
import { getChunkContainingLine } from "../iomd-tools/iomd-selection";

import {
  // IODIDE_API_LOAD_TYPES,
  FETCH_CHUNK_TYPES,
  NONCODE_EVAL_TYPES,
  RUNNABLE_CHUNK_TYPES
} from "../state-schemas/state-schema";

// FIXME validChunkFlags should move to state-schema, or some other place
// where we keep globally relevant things like this.
const validChunkFlags = ["skipRunAll"];

// function createDependencyProposals() {
//   // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
//   // here you could do a server side lookup
//   return [
//     {
//       label: "lodash",
//       kind: monaco.languages.CompletionItemKind.Function,
//       documentation: "The Lodash library exported as Node.js modules.",
//       insertText: '"lodash": "*"'
//     },
//     {
//       label: "loxpress",
//       kind: monaco.languages.CompletionItemKind.Function,
//       documentation: "Fast, unopinionated, minimalist web framework",
//       insertText: '"express": "*"'
//     },
//     {
//       label: "loddirp",
//       kind: monaco.languages.CompletionItemKind.Function,
//       documentation: "Recursively mkdir, like <code>mkdir -p</code>",
//       insertText: '"mkdirp": "*"'
//     }
//   ];
// }

const { Keyword, Snippet, File } = monaco.languages.CompletionItemKind;

const suggestionList = (wordList, itemKind) =>
  wordList.map(word => ({
    label: word,
    kind: itemKind,
    insertText: word
  }));

const suggestionListWithInsertText = (wordList, itemKind) =>
  wordList.map(([label, insertText]) => ({
    label,
    kind: itemKind,
    insertText
  }));

// const suggestionListWithSnippets = wordList =>
//   wordList.map(([label, insertText]) => ({
//     label,
//     kind: Snippet,
//     insertText,
//     insertTextRules:
//       monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
//   }));

// const suggestionListWithSnippets = wordList => ({
//   suggestions: wordList.map(label => ({
//     label,
//     kind: Snippet,
//     insertText: label,
//     insertTextRules:
//       monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
//   }))
// });

const delimLineSuggestion = (lineSoFar, knownChunkTypes) => {
  let suggestions;
  // if (lineSoFar === "%") {
  //   suggestions = suggestionListWithInsertText(
  //     knownChunkTypes.map(ct => [`%% ${ct}`, `% ${ct}`]),
  //     Keyword
  //   );
  //   // } else if (lineSoFar === "%%") {
  // } else
  if (lineSoFar.match("^%%+$")) {
    suggestions = suggestionList(
      knownChunkTypes.map(ct => `${"%".repeat(lineSoFar.length)} ${ct}`),
      Keyword
    );
  } else if (lineSoFar.match(new RegExp(knownChunkTypes.join("|")))) {
    // if the delimLine already includes a valid chunk type
    // then return the valid chunkflags as suggestions...
    suggestions = suggestionList(validChunkFlags, Keyword);
  } else if (lineSoFar.match(/%% */)) {
    // if the delimLine already includes "%%"
    // then return knownChunkTypes
    suggestions = suggestionList(knownChunkTypes, Keyword);
  } else {
    // otherwise, suggest a chunk types with %% prefx
    suggestions = suggestionList(
      knownChunkTypes.map(ct => `%% ${ct}`),
      Keyword
    );
  }
  console.log("sugg", suggestions);
  return { suggestions };
};

const fetchLineSuggestion = (lineSoFar, fileNames) => {
  let suggestions;
  if (lineSoFar.match(/\w+: \w+ *= */)) {
    suggestions = suggestionList(fileNames, File);
  } else {
    // suggestions = suggestionListWithSnippets(
    suggestions = [
      /* eslint-disable no-template-curly-in-string */

      ["css", "css fetch statement", "css: https://${1:styleSheetUrl}"],
      [
        "javascript",
        "JavaScript fetch statement",
        "js: https://${1:scriptUrl}"
      ],
      [
        "plugin",
        "Iodide plugin fetch statement",
        "plugin: https://${1:pluginUrl}"
      ],
      // assignment fetches
      [
        "text",
        "text data fetch statement",
        "text: ${1:varName} = ${2:fileOrUrl}"
      ],
      [
        "json",
        "json data fetch statement",
        "json: ${1:varName} = ${2:fileOrUrl}"
      ],
      [
        "arrayBuffer",
        "arrayBuffer data fetch statement",
        "arrayBuffer: ${1:varName} = ${2:fileOrUrl}"
      ],
      [
        "blob",
        "Blob data fetch statement",
        "blob: ${1:varName} = ${2:fileOrUrl}"
      ]
      /* eslint-enable */
    ].map(([label, detail, insertText]) => ({
      label,
      detail,
      kind: Snippet,
      insertText,
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    }));
    // );

    suggestions.push(
      ...suggestionListWithInsertText(
        FETCH_CHUNK_TYPES.map(x => [x, `${x}: `]),
        Keyword
      )
    );
  }
  console.log("sugg", suggestions);
  return { suggestions };
};

export const iomdCompletionProvider = {
  provideCompletionItems: (model, position, ...args) => {
    console.log("provideCompletionItems", { model, position, args });

    const { iomdChunks, languageDefinitions, notebookInfo } = store.getState();
    const currentChunk = getChunkContainingLine(
      iomdChunks,
      position.lineNumber
    );
    console.log({ currentChunk });

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
    console.log("lineSoFar", lineSoFar);
    switch (completionType) {
      case "delimLine": {
        const knownChunkTypes = Object.keys(languageDefinitions)
          .concat(NONCODE_EVAL_TYPES)
          .concat(RUNNABLE_CHUNK_TYPES);
        return delimLineSuggestion(lineSoFar, knownChunkTypes);
      }
      case "fetch": {
        const fileNames = notebookInfo.files.map(f => f.filename);
        return fetchLineSuggestion(lineSoFar, fileNames);
      }
      default:
        return {};
    }
  }
};
