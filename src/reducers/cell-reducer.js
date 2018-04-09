import MarkdownIt from 'markdown-it'
import MarkdownItKatex from 'markdown-it-katex'
import MarkdownItAnchor from 'markdown-it-anchor'

import { newCell, newCellID, newNotebook } from '../state-prototypes'

import {
  moveCell, scrollToCellIfNeeded,
  getSelectedCellId,
  getCellBelowSelectedId,
  newStateWithSelectedCellPropertySet,
  newStateWithSelectedCellPropsAssigned,
  newStateWithRowOverflowSet,
  newStateWithPropsAssignedForCell,
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
