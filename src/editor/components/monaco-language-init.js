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

import { iomdCompletionProvider } from "./monaco-iomd-completion-provider";

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

monaco.languages.registerCompletionItemProvider("iomd", iomdCompletionProvider);

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
// <div id="hoverDiv">hoverdiv content</div>
//           position: ${JSON.stringify(position)}
// # heading
// some _text_ with **markdown**

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
