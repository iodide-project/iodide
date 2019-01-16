# JSMD format 

## What is JSMD?

JSMD, short for **J**ava**S**cript **M**ark**D**own, is the file format that
Iodide notebooks are written in. It provides a way to interleave the narrative
parts of your notebook, written in Markdown, with the computational parts, written
in Javascript, or through the use of language plugins, in other languages such
as Python or OCaml.

It is simply a collection of contents in different languages,
separated by lines that start with `%%` and indicate the language of the chunk
below.

So, why aren't we just exporting big JSON files like Jupyter and calling it a
day? Importantly, a flat file is easy for both humans and computers to
understand. For example, it works out of the box with standard software
development tools like ``diff`` and Github pull requests. The simplicity of this
format is inspired by [`.Rmd`](https://rmarkdown.rstudio.com/r_notebooks.html)
(RMarkdown notebook) files.

Additionally, since the point of Iodide is to give you a living, breathing
notebook evaluation environment, this means we have a lot less state to export,
so are requirements are much simpler than Jupyter's. Markdown chunks get
rendered when a page loads, libraries get requested from cdns, data gets pulled,
and so on. So you don't need to save the kinds of state you do in a Jupyter
notebook.

## JSMD syntax and usage

As we said above, a JSMD file is just a plain text file with text blocks representing various languages and other evaluation directs delimited by lines starting with `%%`.

A few things to note about JSMD:
- Iodide natively supports the following JSMD chunk types (described in more detail below):
    - `%% js` for Javascript source code
    - `%% md` for Markdown
    - `%% css` for CSS styles
    - `%% fetch` for retrieving resources
    - `%% py` for Python
    - `%% plugin` for Iodide plugins
- Any chunk not of one of the above chunk types will be ignored by Iodide.
- Any blank lines above the first chunk specifier will be ignored.
- Changes to `md` and `css` chunk are immediately applied to your Iodide Report; changes to all other chunk types must be evaluated to take effect (to evaluate, use keyboard shorcuts `ctrl+enter`/`shift+enter` or the play button in the toolbar while your cursor is within the chunk).
- 

A brief example will help to illustrate a few of the details and nuances.

```
this stuff up at the top of your jsmd will be ignored

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

## JSMD chunk types

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

### Javascript (`%% js`)

Javascript chunks allow you to input Javascript that is you can execute within your browser. The code runs within the scope of your Report (in a separate [iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) from the code editor), and allows you to use the full set of [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) available in your browser.

The last value returned by your code chunk is displayed in the Iodide Console.

### CSS (`%% css`)

CSS chunks allow you to input [CSS styles](https://developer.mozilla.org/en-US/docs/Web/CSS) to change the appearance of your report. Like Markdown chunks, these chunks are evaluated while you type, allowing you  get real time feedback as you make changes to your styles.

### Fetch chunks (`%% fetch`)

Fetch chunks provide a convenient way to load (i.e. to "fetch") external resources into the Iodide environment. For the time being, we support the loading:
- Browserified Javascript libraries (npm modules are not supported)
- Style sheets
- Data (from JSON, text, or blobs)

Each line in a fetch cell must specify:
1. the "fetch type", one of `js`, `css`, `json`, `text` or `blob`,
2. the url from which the resource will be fetched

Additionally, data fetches (`json`, `text` or `blob`) must specify the variable name into which the data will be stored.

This example demonstrates how a fetch chunk is used.

```
%% fetch
// NOTE js style comments are allowed as well
js: https://cdnjs.cloudflare.com/ajax/libs/d3/4.10.2/d3.js
css: https://www.exmpl.co/a_stylesheet.css  // end of line comments are ok too
text: csvDataString = https://www.exmpl.co/a_csv_file.csv
json: jsonData = https://www.exmpl.co/a_json_file.json
blob: blobData = https://www.exmpl.co/a_binary_blob.arrow
```

All of the requested resources are downloaded in parallel (asyncronously), but if several evaluations are queued, following chunks will not be evaluated until all the resources are available. This allows you to manage the retrieval of assets in a more syncronous workflow, without having to deal with the asyncronous nature of Web APIs (of course, you are free to manage that complexity with Javascript code and using those APIs if you need that extra control).

In the case of the `js` and `css` fetch types, the scripts and stylesheets are added to the environment as soon as they are available.

In the case of data fetches, which have the syntax `{TYPE}: {VAR_NAME} = {RESOURCE_URL}`, the data is loaded into the variable `VAR_NAME` within your javascript scope. In the case of a `json` fetch, the JSON object retrieved from the URL is parsed into a native javascript object, but in the case of `text` and `blob` fetches, the variable will contain a raw string or [blob object](https://developer.mozilla.org/en-US/docs/Web/API/Blob), respectively.

### Pyodide (`%% py`)

Pyodide chunks allow you to execute Python 3 code in your browser by way of [Pyodide](https://github.com/iodide-project/pyodide), the Python interpreter compiled to WebAssembly.

_Note: the first time you evaluate a `py` chunk, python must be downloaded and initialized, which will take a few moments. Subsequent evaluations will happen immediately._

Pyodide is implemented as an Iodide [language plugin](language_plugins.md).

### Plugins (`%% plugin`)

Plugin chunks allow you to extend the functionality of Iodide by loading plugins. At the time being, Iodide only supports [language plugins](language_plugins.md), which add interpreters for additional languages to your Iodide session.

Plugin chunks must contain a single JSON string that contains the plugin specification. The JSON must contain a "type" field (which for now must be "language")





