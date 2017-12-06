import {store} from './index.jsx'

function isCommandMode(){
  return store.getState().mode=='command' && viewModeIsEditor()
}

function isEditMode(){
  return store.getState().mode=='command'
}

function viewModeIsEditor(){
  return store.getState().viewMode ==='editor'
}

function viewModeIsPresentation(){
  return store.getState().viewMode === 'presentation'
}

function getSelectedCellId(){
  let cells = store.getState().cells
  let index = cells.findIndex((c)=>{return c.selected})
  if (index > -1) {
    return cells[index].id
  } else {
    return undefined // for now
  }
}

function getCellBelowSelectedId(){
  let cells = store.getState().cells
  let index = cells.findIndex((c)=>{return c.selected})
  if (0<=index && index<(cells.length-1)) {
    return cells[index+1].id
  } else {
    return undefined // for now
  }
}

function getCellAboveSelectedId(){
  let cells = store.getState().cells
  let index = cells.findIndex((c)=>{return c.selected})
  if (0<index && index<=(cells.length-1)) {
    return cells[index-1].id
  } else {
    return undefined // for now
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
  getSelectedCellId,
  getCellBelowSelectedId, getCellAboveSelectedId,
  isCommandMode,
  isEditMode,
  viewModeIsEditor, viewModeIsPresentation,
}