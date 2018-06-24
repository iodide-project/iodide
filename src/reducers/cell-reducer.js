import MarkdownIt from 'markdown-it'
import MarkdownItKatex from 'markdown-it-katex'
import MarkdownItAnchor from 'markdown-it-anchor'

import { newCell, newCellID, newNotebook } from '../state-prototypes'

import {
  moveCell, scrollToCellIfNeeded,
  getSelectedCell,
  getSelectedCellId,
  getSelectedCellIndex,
  getCellBelowSelectedId,
  newStateWithSelectedCellPropertySet,
  newStateWithSelectedCellPropsAssigned,
  newStateWithRowOverflowSet,
  newStateWithPropsAssignedForCell,
  checkForHighlightedCells,
  newStateWithPropsAssignedForHighlightedCells,
} from './cell-reducer-utils'

const MD = MarkdownIt({ html: true }) // eslint-disable-line
MD.use(MarkdownItKatex).use(MarkdownItAnchor)

const cellReducer = (state = newNotebook(), action) => {
  let nextState
  switch (action.type) {
    case 'INSERT_CELL': {
      const cells = state.cells.slice()
      const index = cells.findIndex(c => c.id === getSelectedCellId(state))
      const direction = (action.direction === 'above') ? 0 : 1
      const nextCell = newCell(newCellID(state.cells), 'code', state.languageLastUsed)
      cells.splice(index + direction, 0, nextCell)
      nextState = Object.assign({}, state, { cells })
      return nextState
    }
    case 'ADD_CELL': {
      nextState = Object.assign({}, state)
      const language = state.languageLastUsed
      const cells = nextState.cells.slice()
      const nextCell = newCell(newCellID(nextState.cells), action.cellType, language)
      nextState = Object.assign(
        {},
        nextState,
        { cells: [...cells, nextCell] },
        { languageLastUsed: language },
      )
      return nextState
    }

    case 'SELECT_CELL': {
      const cells = state.cells.slice()
      cells.forEach((c) => { c.selected = false })  // eslint-disable-line
      const index = cells.findIndex(c => c.id === action.id)
      const thisCell = cells[index]
      thisCell.selected = true
      if (action.scrollToCell) { scrollToCellIfNeeded(thisCell.id) }
      nextState = Object.assign({}, state, { cells })
      return nextState
    }

    case 'HIGHLIGHT_CELL': {
      const cells = state.cells.slice()
      const index = cells.findIndex(c => c.id === action.id)
      const thisCell = cells[index]
      if (action.revert) thisCell.highlighted = !thisCell.highlighted
      else thisCell.highlighted = true
      nextState = Object.assign({}, state, { cells })
      return nextState
    }

    case 'UNHIGHLIGHT_CELLS': {
      const cells = state.cells.slice()
      cells.forEach((c) => { c.highlighted = false }) // eslint-disable-line
      return Object.assign({}, state, { cells })
    }

    case 'MULTIPLE_CELL_HIGHLIGHT': {
      const cells = state.cells.slice()
      const index1 = getSelectedCellIndex(state)
      const index2 = cells.findIndex(c => c.id === action.id)
      const low = Math.min(index1, index2)
      const high = Math.max(index1, index2)

      cells.forEach((c, index) => {
        if (low <= index && index <= high) {
          c.highlighted = true // eslint-disable-line
        } else {
          c.highlighted = false // eslint-disable-line
        }
      })
      cells[index1].selected = false
      cells[index2].selected = true
      return Object.assign({}, state, { cells })
    }

    case 'CELL_COPY': {
      const cutCells = []
      const cells = state.cells.slice()
      let copiedCells = cells.filter(c => c.highlighted)
      if (!copiedCells.length) {
        copiedCells = [getSelectedCell(state)]
      }
      return Object.assign({}, state, { copiedCells, cutCells })
    }

    case 'CELL_CUT': {
      const copiedCells = []
      let isNotebookEmpty = false
      let cutCells
      let cells = state.cells.slice()
      cutCells = cells.filter(c => c.highlighted)
      if (!cutCells.length) {
        const index = getSelectedCellIndex(state)
        cutCells = [cells[index]]
        if (cells[index + 1]) {
          cells[index + 1].selected = true
        } else if (cells[index - 1]) {
          cells[index - 1].selected = true
        } else {
          isNotebookEmpty = true
        }
        cells.splice(index, 1)
      } else {
        const cutIndices = cells.map((c, i) => (c.highlighted ? i : '')).filter(String)
        const lastHiglighted = cutIndices[cutIndices.length - 1]
        if (cells[lastHiglighted + 1]) {
          cells[lastHiglighted + 1].selected = true
        } else {
          let lastUnHighlightedCell
          let cellIndex = lastHiglighted
          let highlightIndex = cutIndices.length - 1
          while (highlightIndex >= 0 || cellIndex >= 0) {
            if (cutIndices[highlightIndex] !== cellIndex) {
              lastUnHighlightedCell = cellIndex
              break
            }
            cellIndex -= 1
            highlightIndex -= 1
          }
          if (lastUnHighlightedCell) {
            cells[lastUnHighlightedCell].selected = true
          } else {
            isNotebookEmpty = true
          }
        }
        cells = cells.filter(c => !c.highlighted)
      }
      if (isNotebookEmpty) {
        const nextCell = newCell(newCellID(state.cells), 'code')
        nextCell.selected = true
        cells = [nextCell]
      }
      return Object.assign({}, state, { cells, cutCells, copiedCells })
    }

    case 'CELL_PASTE': {
      if (state.copiedCells.length && state.cutCells.length) {
        return state
      }
      const newState = Object.assign({}, state)
      const cells = newState.cells.slice()
      let cellsToPaste = newState.copiedCells.length ?
        newState.copiedCells.slice()
        :
        newState.cutCells.slice()
      const pasteIndex = getSelectedCellIndex(state)
      const newId = newCellID(cells)
      cellsToPaste = cellsToPaste.map((cell, i) => Object.assign(
        {},
        cell,
        { highlighted: false, selected: false, id: newId + i },
      ))
      cells[pasteIndex].selected = false
      cellsToPaste[cellsToPaste.length - 1].selected = true
      cells.splice(pasteIndex + 1, 0, ...cellsToPaste)
      nextState = Object.assign({}, newState, { cells: [...cells], copiedCells: [], cutCells: [] })
      return nextState
    }

    case 'CELL_UP':
      scrollToCellIfNeeded(getSelectedCellId(state))
      return Object.assign(
        {}, state,
        { cells: moveCell(state.cells, getSelectedCellId(state), 'up') },
      )

    case 'CELL_DOWN':
      scrollToCellIfNeeded(getCellBelowSelectedId(state))
      return Object.assign(
        {}, state,
        { cells: moveCell(state.cells, getSelectedCellId(state), 'down') },
      )

    case 'UPDATE_CELL_PROPERTIES':
      if (checkForHighlightedCells(state)) {
        return newStateWithPropsAssignedForHighlightedCells(state, action.updatedProperties)
      }
      return newStateWithPropsAssignedForCell(state, action.cellId, action.updatedProperties)

    case 'UPDATE_INPUT_CONTENT':
      return newStateWithSelectedCellPropertySet(state, 'content', action.content)

    case 'CHANGE_ELEMENT_TYPE':
      return newStateWithSelectedCellPropertySet(state, 'elementType', action.elementType)

    case 'CHANGE_DOM_ELEMENT_ID':
      return newStateWithSelectedCellPropertySet(state, 'domElementID', action.elemID)

    case 'CHANGE_CELL_TYPE': {
      // create a newCell of the given type to get the defaults that
      // will need to be updated for the new cell type
      const { language } = action
      const { rowSettings } = newCell(-1, action.cellType)
      const newState = newStateWithSelectedCellPropsAssigned(
        state,
        {
          cellType: action.cellType,
          value: undefined,
          rendered: false,
          rowSettings,
          language,
        },
      )
      return Object.assign(newState, { languageLastUsed: language })
    }

    case 'SET_CELL_ROW_COLLAPSE_STATE': {
      let { cellId } = action
      if (cellId === undefined) { cellId = getSelectedCellId(state) }
      return newStateWithRowOverflowSet(
        state,
        cellId,
        action.rowType,
        action.viewMode,
        action.rowOverflow,
      )
    }

    case 'MARK_CELL_NOT_RENDERED':
      return newStateWithSelectedCellPropertySet(
        state,
        'rendered', false,
      )

    case 'DELETE_CELL': {
      const selectedId = getSelectedCellId(state)
      const cells = state.cells.slice()
      if (!cells.length) return state
      const index = cells.findIndex(c => c.id === selectedId)
      const thisCell = state.cells[index]
      if (thisCell.selected) {
        let nextIndex = 0
        if (cells.length > 1) {
          if (index === cells.length - 1) nextIndex = cells.length - 2
          else nextIndex = index + 1
          cells[nextIndex].selected = true
        }
      }
      nextState = Object.assign({}, state, {
        cells: cells.filter(cell => cell.id !== selectedId),
      })
      return nextState
    }

    default:
      return state
  }
}

export default cellReducer
