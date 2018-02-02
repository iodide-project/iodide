import {store} from './store.js'

function isCommandMode(){
  return store.getState().mode=='command' && viewModeIsEditor()
}

function viewModeIsEditor(){
  return store.getState().viewMode ==='editor'
}

function viewModeIsPresentation(){
  return store.getState().viewMode === 'presentation'
}

function getCellBelowSelectedId(){
  let cells = store.getState().cells
  let index = cells.findIndex((c)=>{return c.selected})
  console.log(index)
  if (index===cells.length-1){
    // if there is no cell below, return null
    return null
  } else if (0<=index && index<(cells.length-1)) {
    return cells[index+1].id
  } else {
    throw new Error('no cell currently selected')
  }
}

function getCellAboveSelectedId(){
  let cells = store.getState().cells
  let index = cells.findIndex((c)=>{return c.selected})
  console.log(index)
  if (index===0){
    // if there is no cell above, return null
    return null
  } else if (0<index && index<=(cells.length-1)) {
    return cells[index-1].id
  } else {
    throw new Error('no cell currently selected')
  }
}

function getCellById(cells, cellID) {
  // returns a reference to the cell.
  let thisCellIndex = cells.findIndex((c)=> c.id == cellID)
  let thisCell = cells[thisCellIndex]
  return thisCell
}

function prettyDate(time) {
  let date = new Date(time),
    diff = (((new Date()).getTime() - date.getTime()) / 1000),
    day_diff = Math.floor(diff / 86400)
  // return date for anything greater than a day
  if ( isNaN(day_diff) || day_diff < 0 || day_diff > 0 )
  { return date.getDate() + ' ' + date.toDateString().split(' ')[1] }
  
  return day_diff == 0 && (
    diff < 60 && 'just now' ||
      diff < 120 && '1 minute ago' ||
      diff < 3600 && Math.floor( diff / 60 ) + ' minutes ago' ||
      diff < 7200 && '1 hour ago' ||
      diff < 86400 && Math.floor( diff / 3600 ) + ' hours ago') ||
    day_diff == 1 && 'Yesterday' ||
    day_diff < 7 && day_diff + ' days ago' ||
    day_diff < 31 && Math.ceil( day_diff / 7 ) + ' weeks ago'
}

function formatDateString(d) {
  d = new Date(d)
  return d.toUTCString()
}

export {
  prettyDate,
  formatDateString,
  getCellById,
  getCellBelowSelectedId, getCellAboveSelectedId,
  isCommandMode,
  viewModeIsEditor, viewModeIsPresentation,
}