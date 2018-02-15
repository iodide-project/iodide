import notebookReducer from '../src/reducers/notebook-reducer'
import localStorageMock from './mockLocalStorage'
import { newNotebook, blankState, newCell } from '../src/state-prototypes'


window.localStorage = localStorageMock

const EXAMPLE_NOTEBOOK_1 = 'example notebook with content'

function exampleNotebookWithContent(title = EXAMPLE_NOTEBOOK_1) {
  const state = newNotebook()
  state.cells.push(newCell(state.cells, 'javascript'))
  state.cells.push(newCell(state.cells, 'markdown'))
  state.cells[0].selected = true
  state.title = title
  return state
}


describe('blank-state-reducer', () => {
  it('should return the initial state', () => {
    expect(notebookReducer(blankState(), {})).toEqual(blankState())
  })
})

describe('new notebooks', () => {
  const nextState = newNotebook()

  it('should create newNotebook() on NEW_NOTEBOOK', () => {
    expect(notebookReducer(nextState, { type: 'NEW_NOTEBOOK' })).toEqual(newNotebook())
  })
})

describe('misc. notebook operations that don\'t belong elsewhere', () => {
  const state = exampleNotebookWithContent()
  const NEW_NAME = 'changed notebook name'
  it('should change title', () => {
    expect(notebookReducer(state, { type: 'CHANGE_PAGE_TITLE', title: NEW_NAME }).title).toEqual(NEW_NAME)
  })
})

describe('importing a notebook via state', () => {
  const state = newNotebook()
  const nextState = exampleNotebookWithContent()

  it('should import a notebook correctly on IMPORT_NOTEBOOK', () => {
    expect(notebookReducer(state, { type: 'IMPORT_NOTEBOOK', newState: nextState })).toEqual(nextState)
  })
})

describe('saving / deleting localStorage-saved notebooks', () => {
  // this will do enough for now.

  const SAVE_DELETE_NOTEBOOK_NAME = 'save-delete-notebook-tests'
  const state = exampleNotebookWithContent(SAVE_DELETE_NOTEBOOK_NAME)

  it('should save via SAVE_NOTEBOOK', () => {
    notebookReducer(state, { type: 'SAVE_NOTEBOOK' })

    const savedNotebook = JSON.parse(window.localStorage.getItem(SAVE_DELETE_NOTEBOOK_NAME))
    expect(savedNotebook.title).toEqual(state.title)
    expect(savedNotebook.lastSaved).toBeDefined()
    expect(savedNotebook.cells).toEqual(state.cells)
  })

  it('should delete via DELETE_NOTEBOOK', () => {
    notebookReducer(state, { type: 'DELETE_NOTEBOOK', title: SAVE_DELETE_NOTEBOOK_NAME })
    expect(window.localStorage.getItem(SAVE_DELETE_NOTEBOOK_NAME)).toEqual(undefined)
  })
})
