let actions = {
  importNotebook: function (newState) {
    return {
      type: 'IMPORT_NOTEBOOK',
      newState: newState
    }
  },
  exportNotebook: function () {
    return {
      type: 'EXPORT_NOTEBOOK'
    }
  },
  saveNotebook: function (title = undefined , autosave = false) {
    return {
      type: 'SAVE_NOTEBOOK',
      title: title,
      autosave}
  },
  loadNotebook: function (title) {
    return {
      type: 'LOAD_NOTEBOOK',
      title: title
    }
  },
  deleteNotebook: function (title) {
    return {
      type: 'DELETE_NOTEBOOK',
      title: title
    }
  },
  newNotebook: function () {
    return {
      type: 'NEW_NOTEBOOK'
    }
  },
  changePageTitle: function (title) {
    return {
      type: 'CHANGE_PAGE_TITLE',
      title: title
    }
  },
  changeMode: function (mode) {
    return {
      type: 'CHANGE_MODE',
      mode: mode
    }
  },
  setViewMode: function (viewMode) {
    return {
      type: 'SET_VIEW_MODE',
      viewMode: viewMode
    }
  },
  updateInputContent: function (cellID, text) {
    return {
      type: 'UPDATE_INPUT_CONTENT',
      id: cellID,
      content: text
    }
  },
  changeCellType: function (cellID, cellType) {
    return {
      type: 'CHANGE_CELL_TYPE',
      id: cellID,
      cellType: cellType
    }
  },
  clearCellBeforeEvaluation: function (cellID) {
    return {
      type: 'CLEAR_CELL_BEFORE_EVALUATION',
      id: cellID
    }
  },
  evaluateCell: function () {
    return {
      type: 'EVALUATE_CELL'
    }
  },
  runAllCells: function () {
    return {
      type: 'RUN_ALL_CELLS'
    }
  },
  setCellCollapsedState: function (cellID, viewMode, rowType, collapsedState) {
    return {
      type: 'SET_CELL_COLLAPSED_STATE',
      id: cellID,
      viewMode: viewMode,
      rowType: rowType,
      collapsedState: collapsedState
    }
  },
  markCellNotRendered: function (cellID) {
    return {
      type: 'MARK_CELL_NOT_RENDERED',
      id: cellID
    }
  },
  cellUp: function () {
    return {
      type: 'CELL_UP'
    }
  },
  cellDown: function () {
    return {
      type: 'CELL_DOWN'
    }
  },
  insertCell: function (cellType, cellID, direction) {
    return {
      type: 'INSERT_CELL',
      id: cellID,
      cellType: cellType,
      direction: direction
    }
  },
  addCell: function (cellType) {
    return {
      type: 'ADD_CELL',
      cellType: cellType
    }
  },
  selectCell: function (cellID, scrollToCell = false) {
    return {
      type: 'SELECT_CELL',
      id: cellID,
      scrollToCell: scrollToCell
    }
  },
  deleteCell: function (cellID) {
    return {
      type: 'DELETE_CELL',
      id: cellID
    }
  },
  changeElementType: function (cellID, elementType) {
    return {
      type: 'CHANGE_ELEMENT_TYPE',
      id: cellID,
      elementType: elementType
    }
  },
  changeDOMElementID: function (cellID, elemID) {
    return {
      type: 'CHANGE_DOM_ELEMENT_ID',
      id: cellID,
      elemID: elemID
    }
  },
  changeSidePaneMode: function (mode) {
    return {
      type: 'CHANGE_SIDE_PANE_MODE',
      mode}
  }
}

export default actions
