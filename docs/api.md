# API docs

These functions, available within any code cell, aim to improve workflows and
challenges presented by JavaScript and web browsers.

Please direct clarifications or observations of inaccuracy to [our issue
tracker](https://github.com/iodide-project/iodide/issues/new).


## `iodide.file`

The `iodide.file` API provides convenience functions around working with files
uploaded to the Iodide server in your notebook.



### `iodide.file.save(data, fileName[, saveOptions])`

Returns a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises),
which, when resolved, will signal that `data` was uploaded to the server under
the filename `fileName`.

`data` (required) is any object or variable in the eval name space. It can be
anything, really - an array of data, or a csv, or a binary blob.

`fileName` (required) is a string that represents the file name.

The optional argument `saveOptions` has the following keys:

- `overwrite` (optional, default `false`): if `true`, will overwrite whatever is
  at `fileName` with `data`. If `false`, will throw an error and halt the
  subsequent enqueued evaluation (similar to a syntax error).


#### `iodide.file.save` patterns

```javascript

// upload a csv to the server. Assume the object csvData is an array of objects
// representing a columnar dataset. This overwrites whatever is in `cached-data.csv`
// because overwrite is set to true.

const csvData = [{x1: 10, x2: 'test1'}, {x1: 20, x2: 'test2'}, ...]

iodide.file.save(csvData, 'cached-data.csv' { overwrite: true })

// iodide.file.save works with ArrayBuffers as well.
iodide.file.save(new ArrayBuffer(...), 'model-output.bin')
```



### `iodide.file.load(fileName, fileType[, variableName])`

Returns a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
that, when resolved, loads into the notebook the save file `fileName`. For each
notebook can find a list of uploaded files in the [upload modal](#link-required)
or on your notebook's [Revisions Page](#needs-link). You can also access any
uploaded file through the fetch chunk, [following this
pattern](https://iodide-project.github.io/docs/workflows/#uploading-data-to-an-iodide-notebook).
For most use cases using [fetch
chunks](https://iodide-project.github.io/docs/jsmd/#fetch-chunks-fetch) is
preferable and more straightforward. In more dynamic programmatic cases,
however, `iodide.file.load` can provide more nuanced workflows.

`fileName` is the name of the file uploaded to the Iodide server. 

`fileType` is the file type to handle. These are the same as the file types in
[fetch chunks](https://iodide-project.github.io/docs/jsmd/#fetch-chunks-fetch):
`js` (load this file as javascript, eg a library), `css` (load this file as a
stylesheet, applying the styles to the report), `json` (load this file as json
and parse into a javascript object), `text` (load this file as text), `blob`
(load this file as binary).

`variableName` (required for `json`, `text`, and `blob` file types, otherwise
not applicable): the variable name in which to load the data, available in the
browser `window` namespace.


#### `iodide.file.load` patterns

```javascript

// load a csv
iodide.file.load('cached-data.csv', 'text', 'cachedData').then(() => {
  cachedData = d3.csvParsed(cachedData)
})

// load a video
iodide.file.load('gritty.mp4', 'blob', 'gritty').then(() => {
  // load this gritty video into a <video /> tag in the report.
  var urlCreator = window.URL || window.webkitURL;
  var imageUrl = urlCreator.createObjectURL(gritty);
  document.querySelector("#gritty").src = imageUrl;
})

// load a style sheet and apply the style
iodide.file.load('corporate-report-style.css', 'css')

// load some javascript helpers
iodide.file.load('analysis-helpers.js', 'js')
```



### `iodide.file.delete(fileName)`

Deletes the file specified by `fileName`. Returns a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
that when resolved, denotes that the file was deleted on the server.

### `iodide.file.delete` patterns

```javascript
// delete all locally cached pngs

function clearLocalPNGCache() {
  iodide.file.list()
    .filter(filename => !filename.includes('.png'))
    .forEach(iodide.file.delete)
}
```

### `iodide.file.list()`

Returns an Array of file names available to the current notebook.


#### `iodide.file.list` patterns

```javascript
// load each data set and plot it

const plotRequests = iodide.file.list()
  .filter(f => f.filename.includes('.csv'))
  .map(f => iodide.file.load(f, 'text').then((raw) => {
    const data = d3.csvParse(raw)
    ...
    genericPlotFunction(data)
  }))
Promise.all(plotRequests)
```


### `iodide.file.exists(fileName)`

Returns `true` if the file `fileName` is available to the notebook, and `false`
otherwise.

The below code chunk, for instance, checks to see if a csv file already exists
on the server. If it does, then Iodide will load that. Otherwise, the notebook
will fetch the data, process it using a numb er of steps, and save the output to
the server.


#### `iodide.file.exists` patterns

The example below loads cached data if it exists on the server, and otherwise
downloads the larger dataset remotely, processes it, then caches it.

```javascript

const FILENAME = 'dataset.csv'
if (iodide.file.exists(FILENAME)) {
  // since the cached file already exists, let's load it.
  iodide.file.load(FILENAME, 'text', 'evictionsData')
    .then(() => {
      evictionsData = d3.parseCsv(evictionsData)
    })
} else {
  // if we don't have the cached file, let's go ahead
  // and download the bigger one, manipulate it with some
  // function processDataAndReduceItsSize, then save it to the server
  // so the next time we run this code chunk, we'll just load the 
  // cached (smaller) version.
  fetch('http://...')
    .then((r) => r.json())
    .then(processDataAndReduceItsSize)
    .then((finalData) => {
      evictionsData = finalData
      return iodide.file.save(evictionsData, 'dataset.csv', d3.csvFormat)
    })
}
```



### `iodide.file.lastUpdated(fileName)`

returns a `Date` object that represents when the file associated with `fileName`
was last updated.

#### `iodide.file.lastUpdated` patterns

```javascript

// get the oldest csv file

const oldestDate = Math.min(
  ...iodide.file.list()
     .filter(f => f.includes('.csv'))
     .map(iodide.file.lastUpdated)
)
```


## `iodide.addOutputRenderer(rendererSpecification)`

Adds a custom output renderer to Iodide.

An output renderer specification is an object that has two functions:
`shouldRender` and `render`.

- `shouldRender` is a function that takes a value,
  inspects it in some way, and then returns `true` if this renderer should handle
  the value, and `false` otherwise.
- `render` takes a value and returns an HTML string that

Calling `iodide.addOutputRenderer` takes the renderer spec and adds
it to the _end_ of the chain of user-defined renderers that checked whenever a user outputs a return value in a cell.

By way of example, this renderer will inspect a value for `lat` and `lon` keys,
and if they exist, outputs a map centered on the coordinates.

```javascript
const GeoLocationOutputRenderer = {
  shouldRender: (value) => (
    return typeof value === "object" && "lat" in value && "lon" in value;
  ),
  render: (value) => (
    `<img src="http://staticmap.openstreetmap.de/staticmap.php?center=${value.lat},${value.lon}&zoom=17&size=300x200&maptype=mapnik"/>`
  ),
};

iodide.addOutputRenderer(GeoLocationOutputRenderer);
```



## `iodide.clearOutputRenderers()`

Clears all user-defined output renderers that have been added to the Iodide session
using `iodide.addOutputRenderer(rendererSpecification)`

## `iodide.output`

The `iodide.output` API provides convenience functions for programmatically adding DOM elements to your report without having to explicitly include them in a Markdown chunk.

The DOM elements created using these functions are inserted into your report in the order in which they appear in your JSMD code. Importantly, the code chunk that created the element provides a key that allows Iodide to track the location of the element. Because of this, if you evaluate a code chunk that produces a DOM element using these functions, changing that code chunk will cause the element to be removed from your report and you will have to evaluate the code chunk again to refresh the element. (This is ensures that obsolete DOM elements are never left behind when you make code changes)

These convenience functions are only intended to be used for synchronous rendering. If you use them within an asynchronous callback, the DOM elements may be placed in unexpected positions within your report. To ensure that you have full control over the placement of DOM elements that you wish to target within asynchronous operations, it is recommended that you explicitly place a target DOM element within a Markdown chunk.

### `iodide.output.element(nodeType)`
This function creates a DOM element of `nodeType` in your report and returns a reference to the element. This DOM element can then be manipulated using any function that operates on DOM elements or any DOM API provided by the browser.

### `iodide.output.text(string)`
This function takes the given `string`, splits it at each new line, and for each resulting line of text adds a new `div` containing that line to your report.
