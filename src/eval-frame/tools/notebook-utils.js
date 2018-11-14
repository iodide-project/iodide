import { store } from '../store'

function viewModeIsEditor() {
  return store.getState().viewMode === 'EXPLORE_VIEW'
}

function viewModeIsPresentation() {
  return store.getState().viewMode === 'REPORT_VIEW'
}

function getCells() {
  return store.getState().cells
}

function getCellBelowSelectedId() {
  const { cells } = store.getState()
  const index = cells.findIndex(c => c.selected)
  if (index === cells.length - 1) {
    // if there is no cell below, return null
    return null
  } else if (index >= 0 && index < (cells.length - 1)) {
    return cells[index + 1].id
  }
  throw new Error('no cell currently selected')
}

function getCellAboveSelectedId() {
  const { cells } = store.getState()
  const index = cells.findIndex(c => c.selected)
  if (index === 0) {
    // if there is no cell above, return null
    return null
  } else if (index > 0 && index <= (cells.length - 1)) {
    return cells[index - 1].id
  }
  throw new Error('no cell currently selected')
}

function getCellById(cells, cellId) {
  // returns a reference to the cell.
  const thisCellIndex = cells.findIndex(c => c.id === cellId)
  const thisCell = cells[thisCellIndex]
  return thisCell
}

function prettyDate(time) {
  const date = new Date(time)
  const diff = (((new Date()).getTime() - date.getTime()) / 1000)
  const dayDiff = Math.floor(diff / 86400)
  // return date for anything greater than a day
  if (Number.isNaN(dayDiff) || dayDiff < 0 || dayDiff > 0) {
    return `${date.getDate()} ${date.toDateString().split(' ')[1]}`
  }

  return (
    (dayDiff === 0 && (
      (diff < 10 && 'just now') ||
      (diff < 30 && `${Math.floor(diff)} secs ago`) ||
      (diff < 60 && '30 secs ago') ||
      (diff < 120 && '1 min ago') ||
      (diff < 3600 && `${Math.floor(diff / 60)} mins ago`) ||
      (diff < 7200 && '1 hr ago') ||
      (diff < 86400 && `${Math.floor(diff / 3600)} hr ago`))
    ) ||
    (dayDiff === 1 && 'Yesterday') ||
    (dayDiff < 7 && `${dayDiff} days ago`) ||
    (dayDiff < 31 && `${Math.ceil(dayDiff / 7)} weeks ago`)
  )
}

function formatDateString(d) {
  const newd = new Date(d)
  return newd.toUTCString()
}


function getCompletions(token, context) {
  // this function is ported directly from the CodeMirror plugin.
  // Feel free to improve this, but don't judge me for what's here :)
  const stringProps = ('charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight ' +
  'toUpperCase toLowerCase split concat match replace search').split(' ');
  const arrayProps = ('length concat join splice push pop shift unshift slice reverse sort indexOf ' +
 'lastIndexOf every some filter forEach map reduce reduceRight ').split(' ');
  const funcProps = 'prototype apply call bind'.split(' ');
  const javascriptKeywords = ('break case catch class const continue debugger default delete do else export extends false finally for function ' +
  'if in import instanceof new null return super switch this throw true try typeof var void while with yield').split(' ')
  const found = []
  const start = token.string
  const global = window

  function forAllProps(obj, callback) {
    if (!Object.getOwnPropertyNames || !Object.getPrototypeOf) {
      for (const name in obj) callback(name) // eslint-disable-line
    } else {
      for (let o = obj; o; o = Object.getPrototypeOf(o)) {
        Object.getOwnPropertyNames(o).forEach(callback)
      }
    }
  }

  function maybeAdd(str) {
    if (str.lastIndexOf(start, 0) === 0 && !found.includes(str)) found.push(str);
  }
  function gatherCompletions(obj) {
    if (typeof obj === 'string') stringProps.forEach(maybeAdd);
    else if (obj instanceof Array) arrayProps.forEach(maybeAdd);
    else if (obj instanceof Function) funcProps.forEach(maybeAdd);
    forAllProps(obj, maybeAdd)
  }

  if (context && context.length) {
    // If this is a property, see if it belongs to some object we can
    // find in the current environment.
    const obj = context.pop()
    let base
    if (obj.type && obj.type.indexOf('variable') === 0) {
      // if (options && options.additionalContext) { base = options.additionalContext[obj.string]; }
      base = base || global[obj.string]
    } else if (obj.type === 'string') {
      base = '';
    } else if (obj.type === 'atom') {
      base = 1;
    } else if (obj.type === 'function') {
      if (global.jQuery != null && (obj.string === '$' || obj.string === 'jQuery') &&
          (typeof global.jQuery === 'function')) { base = global.jQuery(); } else if (global._ != null && (obj.string === '_') && (typeof global._ === 'function')) { base = global._(); }
    }
    while (base != null && context.length) { base = base[context.pop().string]; }
    if (base != null) gatherCompletions(base);
  } else {
    // If not, just look in the global object and any local scope
    // (reading into JS mode internals to get at the local and global variables)
    for (let v = token.state.localVars; v; v = v.next) maybeAdd(v.name);
    for (let v = token.state.globalVars; v; v = v.next) maybeAdd(v.name);
    gatherCompletions(global)
    javascriptKeywords.forEach(maybeAdd)
  }
  return found
}


export {
  getCells,
  prettyDate,
  formatDateString,
  getCellById,
  getCellBelowSelectedId, getCellAboveSelectedId,
  viewModeIsEditor, viewModeIsPresentation,
  getCompletions,
}
