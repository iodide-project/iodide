# IOMD format

## What is IOMD?

IOMD, short for Iodide MarkDown, is the file format that
Iodide notebooks are written in. It provides a way to interleave the narrative
parts of your notebook, written in Markdown, with the computational parts, written
in JavaScript, or through the use of language plugins, in other languages such
as Python or OCaml.

This format is inspired by MATLAB "cell mode" and [`.Rmd`](https://rmarkdown.rstudio.com/r_notebooks.html)
(RMarkdown notebook) files. It is simply a collection of contents in different languages,
separated by lines that start with `%%` and indicate the language of the chunk
below.

Representing Iodide notebooks with a flat text file makes them easy for both humans and computers to
understand. For example, it works out of the box with standard software
development tools like `diff` and GitHub pull requests.

## IOMD syntax and usage

As we said above, a IOMD file is just a plain text file with text blocks representing various languages and other evaluation directives, and delimited by lines starting with `%%`.

A few things to note about IOMD:

- Iodide natively supports the following IOMD chunk types (described in more detail below):
    - `%% js` for JavaScript source code
    - `%% py` for Python source code
    - `%% md` for Markdown
    - `%% css` for CSS styles
    - `%% fetch` for retrieving resources
    - `%% plugin` for Iodide plugins
    - `%% raw` for raw text (which Iodide will ignore)
- A chunk started with just `%%` but no explicit chunk type will inherit its type of the chunk above it.
- Any chunk with an unknown type will be ignored by Iodide.
- Any blank lines above the first chunk specifier will be ignored.
- Changes to `md` and `css` chunk are immediately applied to your Iodide Report; changes to all other chunk types must be evaluated to take effect (to evaluate, use keyboard shortcuts `ctrl+enter`/`shift+enter` or the play button in the toolbar while your cursor is within the chunk).
- Chunks delimiters can have one or more flags that modify their behavior, for example starting a chunk with `%% js skipRunAll` will prevent that chunk from being run when you press the "Run Full Notebook" button or when the notebook is loaded in report view (which triggers a evaluation of the whole notebook). If a modifier flag is included, the chunk delimiter must include an explicit chunk type. See below for the list of available chunk modifier flags.

A brief example will help to illustrate a few of the details and nuances.

```
this stuff up at the top of your iomd will be ignored

%% md
# this is markdown
_and it will be rendered as such whenever you change it!_

%% js
function bigSlowFunction(x){ ... }

%%
// since the type of this chunk is not specified, it will take type
// "js" from the chunk above.

// delimiting chunks like this can be useful if you want to control
// when you run a certain snippet of code (for example if it's very slow)
let sum = 0
for (var i = 0; i < 1e10; i++) {
  sum = sum + bigSlowFunction(x)
}

%% qwerty
this chunk type is not known by Iodide, so this content will be ignored

```

## IOMD chunk types

### Markdown (`%% md`)

Markdown chunks allow you to enter [Markdown](https://commonmark.org/help/) ([full spec](https://spec.commonmark.org/)), which is immediately rendered in your report preview.

Markdown is a superset of HTML, which means that you can enter HTML directly within a Markdown chunk. This is particularly useful for creating DOM elements that you can target with your scripts later on, like in the following example,:

```
% md
# Section title

A paragraph introducing the topic.

<div id="plot-1"></div>

A paragraph describing plot-1.
```

We can then manipulate `div#plot-1` using standard browser APIs, for example, adding a [d3](https://d3js.org/) or [plotly](https://plot.ly/javascript/) plot within that `div`. _Note, however, that any programmatic changes you make to DOM elements placed within a Markdown chunk will be overwritten if you update that Markdown chunk; in such a case you'll need to re-evaluate the code chunk responsible for the DOM manipulation._

Markdown chunks also support [LaTeX](https://en.wikibooks.org/wiki/LaTeX/Mathematics) for typesetting mathematics. LaTeX expression may be placed inline when written between single dollar signs (`$...$`), or in their own block when set between double dollar signs (`$$...$$`).

```
# Derivatives

Let's begin by discussing an $\epsilon$-$\delta$ argument, then we'll turn to the limit:

$$\lim_{h\to 0} \frac{f(x+h)-f(x)}{h}.$$

```

### JavaScript (`%% js`)

JavaScript chunks allow you to input JavaScript that is you can execute within your browser. The code runs within the scope of your Report (in a separate [iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) from the code editor), and allows you to use the full set of [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) available in your browser.

The last value returned by your code chunk is displayed in the Iodide Console.

_For more information on working with JavaScript in Iodide, be sure to check out our docs about [useful workflows](workflows.md) and the [quirks and workarounds](quirks.md) that might unfamiliar to JS development in other contexts._

### CSS (`%% css`)

CSS chunks allow you to input [CSS styles](https://developer.mozilla.org/en-US/docs/Web/CSS) to change the appearance of your report. Like Markdown chunks, these chunks are evaluated while you type, allowing you get real time feedback as you make changes to your styles.

### Fetch chunks (`%% fetch`)

Fetch chunks provide a convenient way to load (i.e. to "fetch") external resources into the Iodide environment. For the time being, we support the loading:

- Browserified JavaScript libraries (npm modules are not supported)
- Style sheets
- Data (from JSON, text, or blobs)

Each line in a fetch cell must specify:

1. the "fetch type", one of `js`, `css`, `json`, `text`, `arrayBuffer`, `blob`, or `plugin`
2. the url from which the resource will be fetched

Additionally, data fetches (`json`, `text`, `blob`, `arrayBuffer`, and `bytes`) must specify the variable name into which the data will be stored.

This example demonstrates how a fetch chunk is used.

```
%% fetch
// NOTE js style comments are allowed as well
js: https://cdnjs.cloudflare.com/ajax/libs/d3/4.10.2/d3.js
css: https://www.exmpl.co/a_stylesheet.css  // end of line comments are ok too
text: csvDataString = https://www.exmpl.co/a_csv_file.csv
arrayBuffer: bigDataframe = https://www.exmpl.co/a_binary.arrow
json: jsonData = https://www.exmpl.co/a_json_file.json
blob: blobData = https://www.exmpl.co/a_binary_blob.arrow
bytes: binaryData = https://www.exmpl.co/a_binary_file.hdf5
```

All of the requested resources are downloaded in parallel (asynchronously), but if several evaluations are queued, following chunks will not be evaluated until all the resources are available. This allows you to manage the retrieval of assets in a more synchronous workflow, without having to deal with the asynchronous nature of Web APIs (of course, you are free to manage that complexity with JavaScript code and using those APIs if you need that extra control).

In the case of the `js` and `css` fetch types, the scripts and stylesheets are added to the environment as soon as they are available.

The `plugin` type must point to a JSON file containing the same content a [plugin specification](language_plugins.md). It is a shorthand for placing that JSON content directly in a `%% plugin` cell.

In the case of data fetches, which have the syntax `{TYPE}: {VAR_NAME} = {RESOURCE_URL}`, the data is loaded into the variable `VAR_NAME` within your JavaScript scope. The `TYPE` value ensures the following is returned into `VAR_NAME`:

- `json` - returns the JSON object retrieved from the URL, parsed into a native JavaScript object,
- `text` - returns a raw string,
- `arrayBuffer` - returns an [Array Buffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) object,
- `blob` - returns a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object
- `bytes` - returns a [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) object

It is also possible to use a fetch chunk to load files that you have saved to your Iodide notebook by way of the the [Iodide Files UI](workflows.md#getting-data-into-an-iodide-notebook) or the `iodide.file.save` function in the [Iodide API](api.md#iodidefile).

To load a file uploaded to a notebook, you simply provide the name of the file you have previously uploaded (you don't need to supply a full URL). For example, if you have uploaded a file called `myData.json`, you could access it with the following fetch chunk:

```
%% fetch
json: myData = myData.json
```

### Pyodide (`%% py`)

Pyodide chunks allow you to execute Python 3 code in your browser by way of [Pyodide](https://github.com/iodide-project/pyodide), the Python interpreter compiled to WebAssembly.

_Note: the first time you evaluate a `py` chunk, python must be downloaded and initialized, which will take a few moments. Subsequent evaluations will happen immediately._

Pyodide is implemented as an Iodide [language plugin](language_plugins.md).

### Plugins (`%% plugin`)

Plugin chunks allow you to extend the functionality of Iodide by loading plugins. At the time being, Iodide only supports [language plugins](language_plugins.md), which add interpreters for additional languages to your Iodide session.

Plugin chunks must contain a single JSON string that contains the plugin specification. The JSON must contain a "type" field (which for now must be "language")

## Chunk Modifier flags

Chunks delimiters can have one or more flags that modify their behavior. If a modifier flag is included, the chunk delimiter must include an explicit chunk type.

### `skipRunAll`

For the time being, the only flag available is `skipRunAll`, which will prevent the chunk from being run when you press the "Run Full Notebook" button or when the notebook is loaded in report view (which triggers a evaluation of the whole notebook).

This is useful for workflows in which you write and run a computationally expensive code during your exploratory investigation, but you don't want that code to run automatically when a reader visits your notebook in report view. For example the top portion of your notebook might load and process data, upload a smaller intermediate dataset to the server, and then download only that small dataset to be displayed immediately in the report view. This workflow allows you to create a report that loads quickly for you readers, while preserving your exploratory code in place in your notebook.
