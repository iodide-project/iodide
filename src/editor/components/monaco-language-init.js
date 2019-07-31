import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

// import "monaco-editor/esm/vs/basic-languages/python/python.contribution";
// import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution";
// import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
// import "monaco-editor/esm/vs/basic-languages/css/css.contribution";
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
// import {
//   language as htmlLang,
//   conf as htmlConf
// } from "monaco-editor/esm/vs/basic-languages/html/html";

import {
  language as htmlLang,
  conf as htmlConf
} from "../iomd-tools/my-html-def";

import { language as iomdLang } from "../iomd-tools/iomd-monaco-lang-def";

Object.entries({
  iomd: [iomdLang, null],
  js: [jsLang, jsConf],
  // "text/javascript": [jsLang, jsConf],
  md: [mdLang, mdConf],
  css: [cssLang, cssConf],
  // "text/css": [cssLang, cssConf],
  py: [pyLang, pyConf],
  html: [htmlLang, htmlConf]
  // html: [htmlLang, null]
}).forEach(lang => {
  const [langId, langDef] = lang;
  const [langTokens, langConf] = langDef;
  monaco.languages.register({ id: langId });
  monaco.languages.setMonarchTokensProvider(langId, langTokens);
  if (langConf) {
    monaco.languages.setLanguageConfiguration(langId, langConf);
  }
});

// monaco.languages.setLanguageConfiguration("js", {
//   indentationRules: {
//     // ^(.*\*/)?\s*\}.*$
//     // eslint-disable-next-line no-useless-escape
//     decreaseIndentPattern: /^((?!.*?\/\*).*\*\/)?\s*[\}\]\)].*$/,
//     // ^.*\{[^}"']*$
//     increaseIndentPattern: /^((?!\/\/).)*(\{[^}"'`]*|\([^)"'`]*|\[[^\]"'`]*)$/
//   }
// });
