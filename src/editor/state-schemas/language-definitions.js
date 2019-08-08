// This defines the "built-in" language definitions

export const jsLanguageDefinition = {
  pluginType: "language",
  languageId: "js",
  displayName: "Javascript",
  codeMirrorMode: "javascript",
  codeMirrorModeLoaded: true,
  module: "window",
  evaluator: "eval",
  keybinding: "j",
  url: ""
};

const PYODIDE_URL = process.env.USE_LOCAL_PYODIDE
  ? "/pyodide/pyodide.js"
  : "https://pyodide.cdn.iodide.io/pyodide.js";

const pyLanguageDefinition = {
  languageId: "py",
  displayName: "Python",
  codeMirrorMode: "python",
  keybinding: "p",
  url: PYODIDE_URL,
  module: "pyodide",
  evaluator: "runPython",
  asyncEvaluator: "runPythonAsync",
  pluginType: "language"
};

export const languageDefinitions = {
  py: pyLanguageDefinition,
  js: jsLanguageDefinition
};
