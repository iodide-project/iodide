# API docs

These functions, available within any code cell, aim to improve workflows and
challenges presented by JavaScript and web browsers.

Please direct clarifications or observations of inaccuracy to [our issue
tracker](https://github.com/iodide-project/iodide/issues/new).

## `iodide.file`

The `iodide.file` API provides convenience functions for working with files
uploaded to the Iodide server in your notebook.

### `iodide.file.save(fileName, serializerType, data[, saveOptions])`

Returns a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises),
which, when resolved, will signal that `data` was uploaded to the server under the filename
`fileName`. If the file already exists or `data` is not serializable, the Promise will reject.
Because you must own the notebook in order to save files to it, if you do not own a
notebook and run `iodide.file.save` Iodide will throw an error. As such, we suggest including
the [`skipRunAll` tag](https://iodide-project.github.io/docs/iomd/#skiprunall) in the JS chunk
evaluating `iodide.file.save` so that a user viewing your report does not encounter an error. Take
a look at the example in the `iodide.file.save` examples section.

`fileName` (required) is a string that represents the file name.

`serializerType` (required) is a string consisting of one of four options: `text` (applies `.toString()` to `data`), `json` (applies `JSON.stringify(data)`), `arrayBuffer` (saves as a binary array buffer), and `blob` (saves as a `Blob` object). These match the `fetchType` in `iodide.file.load` – if you save with a certain `serializerType`, it is recommended to load it with the same `fetchType`.

`data` (required) is any object or variable in the eval name space. It will be serialized depending on the `serializerType`.

The optional argument `saveOptions` has the following keys:

- `overwrite` (optional, default `false`): if `true`, will overwrite whatever is
  at `fileName` with `data`. If `false`, and the file exists, the Promise will reject.

#### `iodide.file.save` examples

```javascript

// upload a data set as a csv to the server.
// For now, we'll use d3.csvFormat (from https://github.com/d3/d3-dsv) to serialize
// the array of objects.
// This overwrites whatever is in `cached-data.csv` because overwrite is set to true.

%% fetch

// first, let's import d3-dsv, which has the d3.csvFormat function.

js: https://cdnjs.cloudflare.com/ajax/libs/d3-dsv/1.0.8/d3-dsv.js

%% js

const data = [{x1: 10, x2: 'random string'}, {x1: 20, x2: 'another string'}];

iodide.file.save('cached-data.csv', 'text', d3.csvFormat(data), { overwrite: true });

%% js

// this will get csv data from the previous example back into your iodide notebook.

iodide.file.load('cached-data.csv', 'text').then((raw) => {
  const data = d3.csvParse(raw);
  doSomethingWithTheData(data);
});

%% js

// iodide.file.save works with ArrayBuffers as well.
// In this case, we've computed data into a space-efficient
// Int16Array, and want to save it.

async function saveAndLoad() {
  // imagine 1 million entries here.
  await iodide.file.save(
    'model-output.bin',
    'arrayBuffer',
    Int16Array.from([10,342,3,1, ...]));
  // Let's load it back into the notebook.
  const buffer = await iodide.file.load('model-output.bin', 'arrayBuffer');
  // Here, we've reconstructed the array.
  console.log(new Int16Array(buffer));
}

saveAndLoad()
```

Because `iodide.file.save` is only available to a notebook owner, if you are running another user's
notebook, you will encounter an error message. To prevent this for other users, a common pattern is
to use `iodide.file.save` to cache some computation for others, then mark the chunk that contains
`iodide.file.save` as `skipRunAll`. Here is an example:

```javascript

%% js skipRunAll

// if I own this notebook and manually run this chunk, it will save the computed data.
// If I do not own this notebook and manually run this chunk, it will throw an error.
// If I do not own this notebook but open this notebook as a report (?viewMode=report)
// this chunk will be skipped.

fetch('https://...').then((r) => r.json())
  .then((data) => calculateAllCorrelations(data)) // this is expensive.
  .then((correlations) => {
    iodide.file.save('correlations.data', 'json', correlations, {overwrite: true});
  });

%% js

// this chunk will be the one that loads the cached correlations when the notebook
// is opened as a report (that is, all code chunks are evaluated).

iodide.file.load('correlations.data', 'json', 'correlations');

%% js

// the variable 'correlations' is now available in the namespace.

console.log(correlations);
```

The following example shows how to use the `blob` serializer type to save an image from a cat image API, then display it.

```javascript
%% md

<div><img id='cat'/></div>

%% js

const url = 'https://cataas.com/cat/says/hello%20world!';

async function catchTheCatThenDisplay() {
  const cat = await fetch(url).then(r => r.blob());
  // let's save the cat.
  await iodide.file.save('my-next-cat', 'blob', cat, {overwrite: true});
  // now, let's load the cached cat we just saved.
  // we could just use cat from above, but we won't.
  const cachedCat = await iodide.file.load('my-next-cat', 'blob');
  var urlCreator = window.URL || window.webkitURL;
  var imageUrl = urlCreator.createObjectURL(cat);
  document.querySelector("#cat").src = imageUrl;
}

catchTheCatThenDisplay();
```

### `iodide.file.load(fileName, fileType[, variableName])`

Returns a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
that, when resolved, loads into the notebook the save file `fileName`.
If the file does not exist or if you pass in invalid arguments, the Promise will reject. You can
find a list of uploaded files on your notebook's revisions page (available at
`https://iodide.io/notebooks/<notebook-id>/revisions`). You can also access any
uploaded file through the fetch chunk, [following this
pattern](https://iodide-project.github.io/docs/workflows/#uploading-data-to-an-iodide-notebook).
For most use cases using [fetch
chunks](https://iodide-project.github.io/docs/iomd/#fetch-chunks-fetch) is
preferable and more straightforward. In more dynamic cases,
however, `iodide.file.load` can provide more nuanced workflows.

`fileName` is the name of the file uploaded to the Iodide server.

`fileType` is the file type to handle. These are the same as the following data fetch types
available to [fetch chunks](https://iodide-project.github.io/docs/iomd/#fetch-chunks-fetch):

- `json` (load this file as json and parse into a javascript object),
- `text` (load this file as text),
- `arrayBuffer` (load this file into an Array Buffer, especially useful when working with typed arrays)
- `blob` (load this file as a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)) and
- `bytes` (load this file into an Array Buffer then convert it to [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), especially useful when working with APIs that expect a typed array of bytes)

These match the `serializerType` in `iodide.file.save` – if you save with a certain `serializerType`, it is recommended to load it with the same `fetchType`.

`variableName` (required for `json`, `text`, and `blob` file types, otherwise
not applicable): the variable name in which to load the data, available in the
browser `window` namespace.

#### `iodide.file.load` examples

```javascript

%% js

// load a csv

iodide.file.load('cached-data.csv', 'text').then((rawCSV) => {
  const processedData = d3.csvParse(rawCSV);
  // use a plotting library of some sort here:
  plotGraph(processedData, ...);
});

%% js

iodide.file.load('gritty.mp4', 'blob', 'gritty').then(() => {
  // load this gritty video into a <video /> tag in the md chunk below this one.
  var urlCreator = window.URL || window.webkitURL;
  var imageUrl = urlCreator.createObjectURL(gritty);
  document.querySelector("#gritty").src = imageUrl;
});

%% md

<video id='gritty'></video>


%% js

// let's load a json file, then access it in the next chunk.

iodide.file.load('query-results.json', 'json', 'queryResults');

%% js

// the json file should now be available in the object queryResults.

var entries = queryResults.rows.map(...);
```

### `iodide.file.delete(fileName)`

Deletes the file specified by `fileName`. Returns a
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
that when resolved, denotes that the file was deleted on the server. If the file does not exist,
the Promise will reject.

### `iodide.file.delete` examples

```javascript

%% js

// delete all locally cached pngs

function clearLocalPNGCache() {
  iodide.file.list()
    .filter(filename => !filename.includes('.png'))
    .forEach(iodide.file.delete);
};

%% js

// if the file does not exist, we can catch the error and do something instead.

iodide.file.delete('old-dataset.txt')
  .catch(err => {
  return `well, that didn't work: ${err.message}`
});
```

### `iodide.file.list()`

Returns an Array of file names available to the current notebook.

#### `iodide.file.list` examples

```javascript

%% js

// load each data set and plot it

const plotRequests = iodide.file.list()
  .filter(f => f.filename.includes('.csv'))
  .map(f => iodide.file.load(f, 'text').then((raw) => {
    const data = d3.csvParse(raw);
    genericPlotFunction(data);
  }));

Promise.all(plotRequests);
```

### `iodide.file.exists(fileName)`

Returns `true` if the file `fileName` is available to the notebook, and `false`
otherwise.

#### `iodide.file.exists` examples

The example below loads cached data if it exists on the server, and otherwise
downloads the larger dataset remotely, processes it, then caches it.

```javascript

%% js

const FILENAME = 'dataset.csv';
if (iodide.file.exists(FILENAME)) {
  // since the cached file already exists, let's load it.
  iodide.file.load(FILENAME, 'text', 'evictionsData')
    .then(() => {
      evictionsData = d3.parseCsv(evictionsData);
    });
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
      evictionsData = finalData;
      return iodide.file.save(evictionsData, 'dataset.csv', d3.csvFormat);
    })
}
```

### `iodide.file.lastUpdated(fileName)`

Returns a `Date` object that represents when the file associated with `fileName`
was last updated.

#### `iodide.file.lastUpdated` examples

```javascript
// get the oldest csv file

const oldestDate = Math.min(
  ...iodide.file
    .list()
    .filter(f => f.includes(".csv"))
    .map(iodide.file.lastUpdated)
);
```

## `iodide.addOutputRenderer(rendererSpecification)`

Adds a custom output renderer to Iodide.

An output renderer specification is an object that has two functions:
`shouldRender` and `render`.

- `shouldRender` is a function that takes a value,
  inspects it in some way, and then returns `true` if this renderer should handle
  the value, and `false` otherwise.
- `render` takes a value and returns an HTML string. The string is sanitized and may include only the tags `div`, `span`, `ol`, `ul`, `li`, `table`, `thead`, `tbody`, `th`, `tr`, `td`, and `pre`. Additionally, only the atributes `style` and `class` are allowed in these elements.
  - Note that for convenience, we have included the standard set of `[rendered_html](https://github.com/jupyter/notebook/blob/master/notebook/static/notebook/less/renderedhtml.less)` styles from [Jupyter](https://jupyter.org/), so language plugin authors may re-use HTML output from Jupyter kernels (subject to the constraints above), and end up with similar looking results. Please contact us if you encounter difficulties with this.

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

The DOM elements created using these functions are inserted into your report in the order in which they appear in your IOMD code. Importantly, the code chunk that created the element provides a key that allows Iodide to track the location of the element. Because of this, if you evaluate a code chunk that produces a DOM element using these functions, changing that code chunk will cause the element to be removed from your report and you will have to evaluate the code chunk again to refresh the element. (This is ensures that obsolete DOM elements are never left behind when you make code changes.)

These convenience functions are only intended to be used for synchronous rendering. If you use them within an asynchronous callback, the DOM elements may be placed in unexpected positions within your report. To ensure that you have full control over the placement of DOM elements that you wish to target within asynchronous operations, it is recommended that you explicitly place a DOM element within a Markdown chunk, and that you target that element with code in a script.

Note also that because of the way the browser event loop works, if you create or mutate multiple DOM elements within a synchronous loop, all of those changes will be applied to the DOM at once. This means that it it's not possible, for example, to track the progress of a long-running synchronous computation loop by updating a DOM node from the main thread. For situations like this, you may need to use a more advanced technique like a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

### `iodide.output.element(nodeType)`

This function creates a DOM element of `nodeType` in your report and returns a reference to the element. This DOM element can then be manipulated using any function that operates on DOM elements or any DOM API provided by the browser.

### `iodide.output.text(string)`

This function takes the given `string`, splits it at each new line, and for each resulting line of text adds a new `div` containing that line to your report.
