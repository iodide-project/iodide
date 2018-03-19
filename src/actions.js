import { exportJsmdBundle, titleToHtmlFilename } from './jsmd-tools'

export function importNotebook(newState) {
  return {
    type: 'IMPORT_NOTEBOOK',
    newState,
  }
}

export function exportNotebook(exportAsReport = false) {
  return {
    type: 'EXPORT_NOTEBOOK',
    exportAsReport,
  }
}

export function saveNotebook(title = undefined, autosave = false) {
  return {
    type: 'SAVE_NOTEBOOK',
    title,
    autosave,
  }
}

export function loadNotebook(title) {
  return {
    type: 'LOAD_NOTEBOOK',
    title,
  }
}

export function deleteNotebook(title) {
  return {
    type: 'DELETE_NOTEBOOK',
    title,
  }
}

export function newNotebook() {
  return {
    type: 'NEW_NOTEBOOK',
  }
}

export function clearVariables() {
  return {
    type: 'CLEAR_VARIABLES',
  }
}

export function changePageTitle(title) {
  return {
    type: 'CHANGE_PAGE_TITLE',
    title,
  }
}

export function changeMode(mode) {
  return {
    type: 'CHANGE_MODE',
    mode,
  }
}

export function setViewMode(viewMode) {
  return {
    type: 'SET_VIEW_MODE',
    viewMode,
  }
}

export function updateInputContent(text) {
  return {
    type: 'UPDATE_INPUT_CONTENT',
    content: text,
  }
}

export function changeCellType(cellType, language = 'js') {
  return {
    type: 'CHANGE_CELL_TYPE',
    cellType,
    language,
  }
}

export function evaluateCell(cellId) {
  return {
    type: 'EVALUATE_CELL',
    cellId,
  }
}

export function setCellRowCollapsedState(viewMode, rowType, rowOverflow, cellId) {
  return {
    type: 'SET_CELL_ROW_COLLAPSE_STATE',
    viewMode,
    rowType,
    rowOverflow,
    cellId,
  }
}

export function markCellNotRendered() {
  return {
    type: 'MARK_CELL_NOT_RENDERED',
  }
}

export function cellUp() {
  return {
    type: 'CELL_UP',
  }
}

export function cellDown() {
  return {
    type: 'CELL_DOWN',
  }
}

export function insertCell(cellType, direction) {
  return {
    type: 'INSERT_CELL',
    cellType,
    direction,
  }
}

export function addCell(cellType) {
  return {
    type: 'ADD_CELL',
    cellType,
  }
}

export function selectCell(cellID, scrollToCell = false) {
  return {
    type: 'SELECT_CELL',
    id: cellID,
    scrollToCell,
  }
}

export function deleteCell() {
  return {
    type: 'DELETE_CELL',
  }
}

export function changeElementType(elementType) {
  return {
    type: 'CHANGE_ELEMENT_TYPE',
    elementType,
  }
}

export function changeDOMElementID(elemID) {
  return {
    type: 'CHANGE_DOM_ELEMENT_ID',
    elemID,
  }
}

export function changeSidePaneMode(mode) {
  return {
    type: 'CHANGE_SIDE_PANE_MODE',
    mode,
  }
}

export function addLanguage(languageId, evaluate, displayName, codeMirrorMode, keybinding) {
  return {
    type: 'ADD_LANGUAGE',
    languageDefinition: {
      languageId,
      evaluate,
      displayName,
      codeMirrorMode,
      keybinding,
    },
  }
}

export function updateAppMessages(message) {
  return {
    type: 'UPDATE_APP_MESSAGES',
    message,
  }
}

export function exportGist() {
  return (dispatch, getState) => {
    const state = getState()
    const filename = titleToHtmlFilename(state.title)
    const gistData = {
      description: state.title,
      public: true,
      files: {
        [filename]: { content: exportJsmdBundle(state) },
      },
    };
    fetch('https://api.github.com/gists', {
      body: JSON.stringify(gistData),
      method: 'POST',
    })
      .then(response => response.json())
      .then((json) => {
        console.log(json)
        dispatch(updateAppMessages(`Exported to Github gist: 
<a href="${json.html_url}">gist</a> - 
<a href="https://iodide-project.github.io/master/?url=${json.files[filename].raw_url}"> runnable notebook</a>`))
      })
  }
}

