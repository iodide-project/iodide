# How to write a language plugin

## Loading your language plugin in Iodide

The language plugin is specified by a JSON string with the following format:

```
{
  "languageId": "jsx",
  "displayName": "React JSX",
  "codeMirrorMode": "jsx",
  "keybinding": "x",
  "url": "https://raw.githubusercontent.com/hamilton/iodide-jsx/master/docs/evaluate-jsx.js",
  "module": "jsx",
  "evaluator": "evaluateJSX",
  "pluginType": "language"
}
```

The individual fields are described below:

- `languageId`: A short identifier for the language.  This is used to specify the language at the beginning of a [JSMD](jsmd.md) chunk, for example, `%% jsx`.  By convention, this should be the filename extension that is most commonly used for the language.

- `displayName`: A longer name used to identify the language in menus and other UX elements.

- `codeMirrorMode`: The name of the CodeMirror plugin used to provide syntax highlighting for the language.  A list of the available plugin names is [here](https://github.com/codemirror/CodeMirror/tree/master/mode).

- `keybinding`: The key used to select the language.  (TODO: Is this used anymore following the JSMD editing refactor?)

- `url`: The URL to a Javascript source file that defines the language support.  It is evaluated directly in the scope that runs Iodide user code, therefore it should should be "modularized" such that it only adds a single object to the global namespace.

- `module`: The name of the module provided by the Javascript file given by `url`.

- `evaluator`: The name of the function in the module that evaluates code for the custom language.  For example, if `module` is `jsx` and `evaluator` is `evaluateJSX`, Iodide will call `window.jsx.evaluateJSX()` to run code for the custom language.  This function must take a single string argument containing source code, and return an arbitrary Javascript value for the result.  For the best user experience when displaying values in the UI, this object should be a Javascript representation that mirrors as closely as possibly the representation in the plugin language.  To return a custom HTML representation of the object, return an object with a `iodideRender` method, returning a string of raw HTML.

- `asyncEvaluator`: (optional) If evaluating code requires making asynchronous calls, for example, to load additional code from a remote location, an `asyncEvaluator` method should be provided.  It will take precendence over `evaluator` if provided.  It takes a string of source code, but returns a `Promise` that resolves to result value rather than returning the result immediately.  Otherwise, it follows the same conventions as `evaluator`.

- `pluginType`: Must always be `language` for language plugins.  Other values are resolved for other plugin types to be defined in the future.
