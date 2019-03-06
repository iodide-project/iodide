# API docs

These functions, available within any code cell, aim to improve workflows and
challenges presented by JavaScript and web browsers.

Please direct clarifications or observations of inaccuracy to [our issue
tracker](https://github.com/iodide-project/docs/issues/new).

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
