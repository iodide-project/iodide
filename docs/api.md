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
