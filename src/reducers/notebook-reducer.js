import { blankState, newNotebook } from '../notebook-utils.js'

function clearHistory(loadedState) {
  // remove history and declared properties before exporting the state.
  loadedState.declaredProperties = {}
  loadedState.history = []
  loadedState.externalScripts = []
  loadedState.executionNumber = 0
}

let notebook = function (state=newNotebook(), action) {
  switch (action.type) {
    case 'NEW_NOTEBOOK':
      var newState = newNotebook()
      return newState

    case 'EXPORT_NOTEBOOK':
      var outputState = Object.assign({}, state)
      clearHistory(outputState)
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(outputState))
      var dlAnchorElem = document.getElementById('export-anchor')
      dlAnchorElem.setAttribute("href", dataStr)
      var title = state.title
      var filename = state.title.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.json'
      dlAnchorElem.setAttribute("download", filename)
      dlAnchorElem.click()
      return Object.assign({}, state)

    case 'IMPORT_NOTEBOOK':
      // this may need to be refactored
      var newState = action.newState
      return newState

    case 'SAVE_NOTEBOOK':
      var lastSaved = new Date()
      var outputState = Object.assign({}, state, {lastSaved})
      clearHistory(outputState)
      var title
      if (action.title!==undefined) title = action.title
      else title = state.title
      localStorage.setItem(title, JSON.stringify(outputState))
      return Object.assign({}, state, {lastSaved})

    case 'LOAD_NOTEBOOK':
      var loadedState = JSON.parse(localStorage.getItem(action.title))
      return Object.assign({}, loadedState)

    case 'DELETE_NOTEBOOK':
      var title = action.title
      if (localStorage.hasOwnProperty(title)) localStorage.removeItem(title)
      if (title === state.title) {
        var newState = Object.assign({}, newNotebook())
      } else {
        var newState = Object.assign({}, state)
      }
      return newState

    case 'CHANGE_PAGE_TITLE':
      return Object.assign({}, state, {title: action.title})

    case 'CHANGE_MODE':
      var mode = action.mode
      return Object.assign({}, state, {mode});
    
    case 'CHANGE_SIDE_PANE_MODE':
      return Object.assign({}, state, {sidePaneMode: action.mode})
    
    default:
        return state
  }
}

  export default notebook