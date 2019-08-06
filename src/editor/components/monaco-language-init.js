import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import {
  language as cssLang,
  conf as cssConf
} from "monaco-editor/esm/vs/basic-languages/css/css";
import {
  language as mdLang,
  conf as mdConf
} from "monaco-editor/esm/vs/basic-languages/markdown/markdown";
import {
  language as jsLang,
  conf as jsConf
} from "monaco-editor/esm/vs/basic-languages/javascript/javascript";
import {
  language as pyLang,
  conf as pyConf
} from "monaco-editor/esm/vs/basic-languages/python/python";

import {
  language as iomdLang,
  conf as iomdConf
} from "../iomd-tools/iomd-monaco-lang-def";

import {
  language as fetchLang,
  conf as fetchConf
} from "../iomd-tools/fetch-monaco-lang-def";

Object.entries({
  iomd: [iomdLang, iomdConf],
  fetch: [fetchLang, fetchConf],
  js: [jsLang, jsConf],
  md: [mdLang, mdConf],
  css: [cssLang, cssConf],
  py: [pyLang, pyConf]
}).forEach(lang => {
  const [langId, langDef] = lang;
  const [langTokens, langConf] = langDef;
  monaco.languages.register({ id: langId });
  monaco.languages.setMonarchTokensProvider(langId, langTokens);
  if (langConf) {
    monaco.languages.setLanguageConfiguration(langId, langConf);
  }
});

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

// monaco.languages.registerCompletionItemProvider("iomd", {
//   // provideCompletionItems: () => {

//   provideCompletionItems: (model, position, ...args) => {
//     console.log("provideCompletionItems", model, position, args);
//     // find out if we are completing a property in the 'dependencies' object.
//     const textUntilPosition = model.getValueInRange({
//       startLineNumber: 1,
//       startColumn: 1,
//       endLineNumber: position.lineNumber,
//       endColumn: position.column
//     });
//     console.log({ textUntilPosition });
//     // const match = textUntilPosition.match(
//     //   /"dependencies"\s*:\s*{\s*("[^"]*"\s*:\s*"[^"]*"\s*,\s*)*("[^"]*)?$/
//     // );
//     const suggestions = createDependencyProposals();
//     return { suggestions };
//   }
// });

// monaco.languages.registerHoverProvider("iomd", {
//   provideHover: (model, position) => {
//     console.log("provideHover");
//     window.HOVER_MODEL = model;
//     return {
//       range: new monaco.Range(
//         1,
//         1,
//         model.getLineCount(),
//         model.getLineMaxColumn(model.getLineCount())
//       ),
//       contents: [
//         { value: "**SOURCE**" },
//         {
//           value: `
// position: ${JSON.stringify(position)}
//           \`\`\`html
//   <body>
//     <div class="test">
//       <script>
//         // #regi
//         function asdf() {
//           alert("hi <script>"); // javascript
//           (() => 4 + 4 + 2 + "13")()
//         }
//         window.history.back;
//               // #endregion
//       </script>
//       <script type="text/x-dafny">
//               class Foo {
//                 x : int;
//               invariant x > 0;
//             };
//           </script>
//         </div>
//       </body>
// </html>

//         \`\`\``
//         }
//       ]
//     };
//   }
// });
