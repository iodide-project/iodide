import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { FETCH_CHUNK_TYPES } from "../../state-schemas/state-schema";
import { makeSuggestionList } from "./make-suggestion-list";

const { Keyword, Snippet, File } = monaco.languages.CompletionItemKind;

export const fetchLineSuggestion = (lineSoFar, fileNames) => {
  let suggestions;
  if (lineSoFar.match(/\w+: +\w+ *= */)) {
    // if the line matches the pattern of an assignment fetch
    // then offer filename completions
    suggestions = makeSuggestionList(fileNames, File);
  } else {
    // default: offer fetch type templates
    suggestions = [
      /* eslint-disable no-template-curly-in-string */
      {
        label: "css",
        detail: "css fetch statement",
        insertText: "css: https://${1:styleSheetUrl}"
      },
      {
        label: "javascript",
        detail: "JavaScript fetch statement",
        insertText: "js: https://${1:scriptUrl}"
      },
      {
        label: "plugin",
        detail: "Iodide plugin fetch statement",
        insertText: "plugin: https://${1:pluginUrl}"
      },
      // assignment fetches
      {
        label: "text",
        detail: "text data fetch statement",
        insertText: "text: ${1:varName} = ${2:fileOrUrl}"
      },
      {
        label: "json",
        detail: "json data fetch statement",
        insertText: "json: ${1:varName} = ${2:fileOrUrl}"
      },
      {
        label: "arrayBuffer",
        detail: "arrayBuffer data fetch statement",
        insertText: "arrayBuffer: ${1:varName} = ${2:fileOrUrl}"
      },
      {
        label: "blob",
        detail: "Blob data fetch statement",
        insertText: "blob: ${1:varName} = ${2:fileOrUrl}"
      },
      {
        label: "bytes",
        detail: "bytes data fetch statement",
        insertText: "bytes: ${1:varName} = ${2:fileOrUrl}"
      }
      /* eslint-enable */
    ].map(itemProps => ({
      kind: Snippet,
      insertTextRules:
        monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      ...itemProps
    }));

    // and in addition to the templates, insert strings like "json:"
    // for each known fetch type (if people don't want the whole template)
    suggestions.push(
      ...FETCH_CHUNK_TYPES.map(x => ({
        label: x,
        insertText: `${x}: `,
        itemKind: Keyword
      }))
    );
  }
  return { suggestions };
};
