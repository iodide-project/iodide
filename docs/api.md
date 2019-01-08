# API docs

These functions, available within any code cell, aim to improve workflows and
challenges presented by Javascript and web browsers.

Please direct clarifications or observations of innacuracy to [our issue
tracker](https://github.com/iodide-project/docs/issues/new).

## `iodide.environment`

Functions for saving the state of variables and exporting data with your notebook.

### `iodide.environment.freeze(obj)`

Serializes as JSON then compresses the state of an object. `obj` will freeze the
value under the namespace of the key. Once the notebook is exported, the state
will be added to the embedded JSMD in the html document. Freezing is
_additive_ - every call to `iodide.environment.freeze` will either update or add
a new bit of state, but will not overwrite key-value pairs not explicitly
updated.

```javascript
var x = [{a: 10000, b: 20000}, {a: 1043, b: 29343}]
var y = 'iodide'
iodide.environment.freeze({x, y})
```

### `iodide.environment.freezeRawString`

Same as `iodide.environment.freeze`, but will not compress the value.

### `iodide.environment.get(key)`

Retrieves the serialized data.

```javascript
let xData = iodide.environment.get('x')
```

### `iodide.environment.list`

Returns an array of keys of the set of currently frozen variables.

```javascript
var x = [{a: 10000, b: 20000}, {a: 1043, b: 29343}]
var y = 'iodide'
iodide.environment.freeze({x, y})

iodide.environment.list()
> ['x', 'y']
```

### `iodide.environment.clear`

Removes all frozen variables from the environment.

```javascript
iodide.environment.clear()
iodide.environment.list()
> []
```

## `iodide.evalQueue`

Functions for pausing and resuming the cell evaluation queue. Useful for
awaiting the end of an asynchronous call or process of some sort before
continuing onto the next cell.

### `iodide.evalQueue.await(arrayOfPromises)`

Works similarly to `Promise.all`. Once all the Promises contained in
`arrayOfPromises` resolve (or reject), iodide is allowed to evaluate other
cells.

This is the easiest way to fetch a number of data sources, delaying other cells
from being evaluated until you have the data you need.

```javascript
var data1
var data2

iodide.evalQueue.await([
  fetch('whatever.com/data1.json').then(d=>d.json()).then(d => data1=d),
  fetch('whatever.com/someComplicatedData2.json').then(d => d.json()).then(d => data2=d),
])
```

### `iodide.evalQueue.requireExplicitContinuation()`

This function explicitly sets a flag to delay any further cell evaluation until
the user has encountered `iodide.evalQueue.continue()`.

It is vital that when using `iodide.evalQueue` functions that you properly build
in error catching.

### `iodide.evalQueue.continue()`

This function sets a flag to move on to the next cell execution after the block
in which it is executed has completed.

By way of an example, this code block will await the resolution of a `Promise`
before moving to the next cell.

```javascript
iodide.evalQueue.requireExplicitContinuation()
var url = 'https://gist.githubusercontent.com/hamilton/67d7904af5cd696ec2b12450b69bd657/raw/15d83f7f281c3e5de2ca3359529ef041b47fcbf6/css'

fetch(url).then(d=>d.text())
  .then(data=>{
 	 return data.split('\n').map(d=>d.split(","))
  })
  .then(data=>{
    let header = data[0]
    let body = data.slice(1)
    return body.map(di=>{
      let out = {}
      header.forEach((h,i)=>{
        out[h] = di[i]
      })
      return out
    })
  })
  .then(data=>{
  // format data a bit more nicely!
  iodide.evalQueue.continue()
  return data.map(d=>{
      d.neighborhood = d.nbrhd
      delete d.nbrhd
      d.evictionNotices = d.count
      delete d.count
      d.date = new Date(d.date)
      return d
    })
})
```

Here is another example to further clarify, using a Promise directly.

```javascript
iodide.evalQueue.requireExplicitContinuation()

let dataSet = new Promise((resolve, reject) => {
    let counter = 0
    let timer = setInterval(() => {
        counter += 1
        if (counter > 10) {
            iodide.evalQueue.continue()
            resolve('finished!') // resolve the promise
            clearInterval(timer)
        }
    }, 300)
})
```

## `iodide.addOutputHandler(handler)`

Adds a custom output handler to Iodide. Check out [this example
notebook](https://iodide.io/iodide-examples/output-handling.html).

An output handler is an object or function that has two functions:
`shouldHandle` and `render`. `shouldHandle` is a function that takes a value,
inspects it in some way, and then returns `true` if this handler should handle
it, and `false` otherwise. `iodide.addOutputHandler` takes the handler and adds
it to the chain of handlers checked whenever a user outputs a return value in a
cell.

By way of example, this handler will inspect a value for `lat` and `lon` keys,
and if they exist, outputs a map centered on the coordinates.

```javascript
const GeoLocationOutputHandler = {
    shouldHandle: function(value) {
        return (typeof value === 'object') && 'lat' in value && 'lon' in value
    },

    render: function(value, inContainer) {
        // return a HTMLElement, as created by document.createElement
        let img = document.createElement('img')
        let size = inContainer ? "150x100" : "600x300"
        img.src = 'http://staticmap.openstreetmap.de/staticmap.php?center=' + value.lat + ',' + value.lon +
          '&zoom=17&size=' + size + '&maptype=mapnik'
        return img
    }
}

iodide.addOutputHandler(GeoLocationOutputHandler)

```
