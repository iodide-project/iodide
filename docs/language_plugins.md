# Language plugins

Iodide supports programming languages other than JavaScript through the use of
language plugins.

Languages that are mature and well supported automatically load when you create
and run a IOMD chunk for that language. These are called "built-in" because
Iodide knows about them, even if support is loaded dynamically only when needed.
Other languages require the use of a language plugin chunk, described below.

Not all language plugins have the same level of interoperability between
JavaScript and the plugin language. We've defined the following approximate
levels of support to make it easier to know what to expect.

- Level 1: The plugin just provides string output, so is useful as a basic
  console REPL (read-eval-print-loop).
  
- Level 2: The plugin converts basic data types (numbers, strings, arrays and
  objects) to and from JavaScript.
  
- Level 3: The plugin supports sharing of class instances (objects with methods)
  between the plugin language and JavaScript.
  
- Level 4: The plugin supports sharing of *n*-dimensional arrays and data frames
  between the plugin language and JavaScript.
  
| Project                                                                         | Language       | Level 1 | Level 2 | Level 3 | Level 4 | Built-in |
|---------------------------------------------------------------------------------|----------------|---------|---------|---------|---------|----------|
| [Pyodide](http://github.com/iodide-project/pyodide)                             | Python         | ✓       | ✓       | ✓       | partial | ✓        |
| [Julide](https://github.com/keno/julia-wasm)                                                                        | Julia           | ✓        | ✓       | ✓       |         |          |
| [AssemblyScript](https://alpha.iodide.io/notebooks/1234) | AssemblyScript | ✓       | ✓       |         |         |          |
| [Lua](https://alpha.iodide.io/notebooks/1416/)            | Lua            | ✓       | ✓       |         |         |          |
| [Opal](https://alpha.iodide.io/notebooks/1453/)           | Ruby           | ✓       | ✓       |         |         |          |
| [Domical](https://github.com/louisabraham/domical)                              | OCaml          | ✓       |         |         |         |          |
| [PlantUml](https://github.com/six42/iodide-plantuml-plugin)                              | PlantUml          | ✓       |         |         |         |          |

(We try to keep the above table up-to-date, but things fall through the cracks.
Let us know on [GitHub](http://github.com/iodide-project/iodide/) if you see anything
needs updating).

## Using a custom language plugin

The language plugin is specified by a IOMD chunk containing a JSON string with
the following format:

```
%% plugin

{
  "languageId": "jsx",
  "displayName": "React JSX",
  "url": "https://raw.githubusercontent.com/hamilton/iodide-jsx/master/docs/evaluate-jsx.js",
  "module": "jsx",
  "evaluator": "evaluateJSX",
  "pluginType": "language"
}
```

The individual fields are described below:

- `languageId`: A short identifier for the language.  This is used to specify the language at the beginning of a [IOMD](iomd.md) chunk, for example, `%% jsx`.  By convention, this should be the filename extension that is most commonly used for the language.

- `displayName`: A longer name used to identify the language in menus and other UX elements.

- `url`: The URL to a JavaScript source file that defines the language support.  It is evaluated directly in the scope that runs Iodide user code, therefore it should should be "modularized" such that it only adds a single object to the global namespace.

- `module`: The name of the module provided by the JavaScript file given by `url`.

- `evaluator`: The name of the function in the module that evaluates code for the custom language.  For example, if `module` is `jsx` and `evaluator` is `evaluateJSX`, Iodide will call `window.jsx.evaluateJSX()` to run code for the custom language.  This function must take a single string argument containing source code, and return an arbitrary JavaScript value for the result.  For the best user experience when displaying values in the UI, this object should be a JavaScript representation that mirrors as closely as possibly the representation in the plugin language.  To return a custom HTML representation of the object, return an object with a `iodideRender` method, returning a string of raw HTML.

- `asyncEvaluator`: (optional) If evaluating code requires making asynchronous calls, for example, to load additional code from a remote location, an `asyncEvaluator` method should be provided.  It will take precedence over `evaluator` if provided.  It takes a string of source code, but returns a `Promise` that resolves to result value rather than returning the result immediately.  Otherwise, it follows the same conventions as `evaluator`.

- `autocomplete`: (optional) The name of the function to get autocomplete candidates.  This function must accept a single argument `code`, and return a array of strings representing candidate completions. _Note_: language plugin authors are encouraged to see whether there is a Jupyter kernel that implement this functionality for their language; such code could be adapted by setting the `cursor_pos` argument expected by Jupyter to the final position in the `code` string (Iodide always passes code strings that are truncated to the cursor's position). Please see the [Jupyter docs](https://jupyter-client.readthedocs.io/en/stable/messaging.html#completion).

- `pluginType`: Must always be `language` for language plugins.  Other values are resolved for other plugin types to be defined in the future.

If desired, you may also place the language plugin definition inside a json file and load it using a fetch cell as follows:

```
%% fetch
plugin: https://example.com/plugin-definition.json
```

See the iomd documentation on [chunk types](../iomd/#iomd-chunk-types) for more details.
