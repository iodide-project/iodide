/*
Cloning dplyr in Javascript, sort of
====================================
Works on arrays of objects.
usage:
var transformation = DS.data(arrayOfObjects)
	.standardize()
	.mutate({url: d=>d.replace('https://','')})
    .select('url', 'country', 'os', 'processor')
    .groupBy('country', 'url')
    .summarize({
    	total: ds=>ds.length,
        nonWindows: ds=> ds.filter(d=>d!='windows').length
    }).arrange('total').get()
# guide ----
standardize: looks at all the possible keys in each row, and creates a new dataset where
	where the rows have all keys, and null values if key wasn't there before.
mutate: functions like in dplyr. Pass in an object of key-value pairs, where key is new value name, value
	is a function.
select: creates a new dataset with the following variables. You can also pass in a function that will select variables
	according to the key set.
groupBy: does the dirty work of grouping the rows of a dataset according to the values you give it.
summarize: only works with a groupBy before it. Takes those groups, and then reduces them appropriately.
arrange: sorts by all the keys you pass it, or w/ functions of the keys.
*/

var DS = {}

class DataSet {
  constructor(data) {
    	this.data = data
    this.operations = []
  }
  
  	arrange() {
    this.operations.push([_arrange, ...arguments])
    return this
  }
  
  	mutate() {
    this.operations.push([_mutate, ...arguments])
    return this
  }
    
  	select() {
    this.operations.push([_select, ...arguments])
    return this
  }
  
  	groupBy() {
    this.operations.push([_groupBy, ...arguments])
    return this
  }
  
  	standardize() {
    this.operations.push([_standardize, ...arguments])
    return this
  }
  	
  	summarize() {
    this.operations.push([_summarize, ...arguments])
    return this
  }
  
  	filter() {
    this.operations.push([_filter, ...arguments])
    return this
  }

  transform() {
    this.operations.push([_transform, ...arguments])
    return this
  }
  
  get() {
    var out = this.data.slice()
    this.operations.forEach(op=>{
      out = op[0](out, ...op.slice(1))
    })
    return out
  }
}

function twoSimpleObjects(k) {
  return function(v) {
    var allKeys = [].concat(...Object.keys(k), ...Object.keys(v))
    return allKeys.every(ki=>{
      return v.hasOwnProperty(ki) && k.hasOwnProperty(ki) && v[ki] == k[ki]
    })
  }
}

function _filter(dataset, ...filters) {
  return dataset.filter(d=>{
    return filters.every(f=>{
      return f(d)
    })
  })
}

function _transform(dataset, fcn) {
  return fcn(dataset)
}

function _mutate(dataset, how){
  dataset.forEach(d=>{
    Object.keys(how).forEach(howName=>{d[howName] = how[howName](d)})
  })
  return dataset
}

function _select(dataset, ...selections) {
  var candidates = Object.keys(dataset[0])
  var keys = [].concat(...selections.map(selection=>{
    if (typeof selection === 'string') {
      return [selection]
    } else if (typeof selection === 'function') {
      return candidates.filter(selection)
    }
  }))
  
  var out = dataset.map(d=>{
    var _d = {}
    keys.forEach(c=>{
      _d[c] = (d.hasOwnProperty(c)) ? d[c] : null
    })
    return _d
  })
  return out
}

function colMap(arr, cols) {
  return cols.map(c=>{
    if (typeof c === 'string') return arr[c]
    if (typeof c === 'function') return c(arr)
  })
}

function arrangeComp(cols) {
  return function(a,b) {
    var acols = colMap(a, cols)
    var bcols = colMap(b, cols)
    var outval = 0
    acols.every((ai,i)=> {
      if (ai > bcols[i]) {
        outval = 1
        return false
      }
      if (ai < bcols[i]) {
        outval = -1
        return false
      }
      return true
    })
    return outval
  }
}

function _arrange(dataset, ...columns) {
  dataset.sort(arrangeComp(columns)); return dataset
}

function _standardize(dataset) {
  var keys = new Set()
  dataset.forEach(d=>{Object.keys(d).forEach(di=>keys.add(di))})
  dataset.forEach(d=>keys.forEach(k=>{if (!d.hasOwnProperty(k)) d[k]=null}))
  return dataset
}

function _groupBy(dataset, ...groups){
  var out = {
    translation: {},
    map: {}
  }
  
  dataset.forEach(d=>{
    var keyString = groups.map((gr)=>{
      var val = 10
      if (typeof gr==='string') {val = d[gr]}
      if (typeof gr==='object') {
        var k = Object.keys(gr)[0]
        val = gr[k](d)
      }
      return val
    })
    var key = groups.map((gr,i)=>{
      var kout = {}
      if (typeof gr === 'string') {kout[gr] = d[gr]}
	  if (typeof gr === 'object') {
        Object.keys(gr).forEach(grk=>{
          kout[grk] = gr[grk](d)
        })
      }
      return kout
    })
    out.translation[keyString] = key
    if (!out.map.hasOwnProperty(keyString)) out.map[keyString] = []
    out.map[keyString].push(Object.assign({}, d))
  })
  return out
}

function _summarize(dataObj, ...summaries){
  var dataset = dataObj.map
  var trans = dataObj.translation
  var outSet = []
  Object.keys(dataset).forEach(k=>{
    var keys = [...trans[k]]
    var ds = dataset[k] // array or objs here
    var outD = {}
    keys.forEach(ks=>{
      var k = Object.keys(ks)[0]
      var v = ks[k]
      outD[k] = v
    })
    summaries.forEach(summarySet=>{
      Object.keys(summarySet).forEach(s=>{
    	  outD[s] = summarySet[s](ds)
	    })
    })
    outSet.push(outD)
  })
  return outSet
}

function sequence() {
  var fns = arguments
  return function (result) {
    fns.forEach((fn,i)=> {result = fn.call(this, result)})
    return result
  }
}

DS.pluck=function(arrayOfObjects, ...keys) {
  return arrayOfObjects.map(d=> keys.map(k=>d[k]))
}

DS.frequency=function(arrayOfScalars) {
  return arrayOfScalars.reduce((out, v)=>{out[v] = (out[v] || 0) + 1}, {})
}

DS.proportion=function(arrayOfScalars) {
  var freqs = DS.frequency(arrayOfScalars)
  var total = Objects.keys(freqs).reduce((out,a) => out+total[a], 0)
  Object.keys(freqs).forEach((d) => freqs[d] = freqs[d] / total)
  return freqs
}

DS.data = (data, options)=>new DataSet(data)