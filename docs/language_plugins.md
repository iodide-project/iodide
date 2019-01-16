# How to write a language plugin

## Loading your language plugin in Iodide

The language plugin is specified by a JSON string with the following format:

```
{
  "languageId": "jsx",
  "displayName": "jsx",
  "codeMirrorMode": "jsx",
  "keybinding": "x",
  "url": "https://raw.githubusercontent.com/hamilton/iodide-jsx/master/docs/evaluate-jsx.js",
  "module": "jsx",
  "evaluator": "evaluateJSX",
  "pluginType": "language"
}
```

Each of the fields means ...
