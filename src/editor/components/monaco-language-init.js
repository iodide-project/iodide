import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

// import "monaco-editor/esm/vs/basic-languages/python/python.contribution";
// import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution";
// import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
// import "monaco-editor/esm/vs/basic-languages/css/css.contribution";
import { language as css } from "monaco-editor/esm/vs/basic-languages/css/css";
import { language as md } from "monaco-editor/esm/vs/basic-languages/markdown/markdown";
import { language as js } from "monaco-editor/esm/vs/basic-languages/javascript/javascript";
import { language as py } from "monaco-editor/esm/vs/basic-languages/python/python";

import { language as iomd } from "../iomd-tools/iomd-monaco-lang-def";

Object.entries({ iomd, js, md, css, py }).forEach(entry => {
  const [langId, langDef] = entry;
  monaco.languages.register({ id: langId });
  monaco.languages.setMonarchTokensProvider(langId, langDef);
});
