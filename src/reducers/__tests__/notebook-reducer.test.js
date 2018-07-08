import '../../store'
import notebookReducer from '../notebook-reducer'
import { newNotebook, addNewCellToState } from '../../state-prototypes'
import {
  // exportJsmdBundle, we'll need to test this
  // stringifyStateToJsmd, we'll need to test this
  stateFromJsmd,
} from '../../tools/jsmd-tools'

const EXAMPLE_NOTEBOOK_1 = 'example notebook with content'

function exampleNotebookWithContent(title = EXAMPLE_NOTEBOOK_1) {
  let state = newNotebook()
  state = addNewCellToState(state, 'code')
  state = addNewCellToState(state, 'markdown')
  state.cells[0].selected = true
  state.title = title
  return state
}

beforeEach(() => {
  localStorage.clear();
});

describe('blank-state-reducer', () => {
  it('should return the initial state', () => {
    expect(notebookReducer(newNotebook(), {})).toEqual(newNotebook())
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

  notebookReducer(state, { type: 'SAVE_NOTEBOOK' })
  const savedNotebook = stateFromJsmd(localStorage.getItem(SAVE_DELETE_NOTEBOOK_NAME))

  it('saved notebook should have correct title', () => {
    expect(savedNotebook.title).toEqual(state.title)
  })

  it('saved notebook should have lastSaved time', () => {
    expect(savedNotebook.lastSaved).toBeDefined()
  })

  it('saved notebook should have correct cell, up to cell ids', () => {
    // note that cellIds may change between save/load, because jsmd does not store cellIds
    // let's reset all the cellIds in both
    savedNotebook.cells.forEach((c, i) => { c.id = i }) // eslint-disable-line
    state.cells.forEach((c, i) => { c.id = i }) // eslint-disable-line
    expect(savedNotebook.cells).toEqual(state.cells)
  })

  it('should delete via DELETE_NOTEBOOK', () => {
    notebookReducer(state, { type: 'DELETE_NOTEBOOK', title: SAVE_DELETE_NOTEBOOK_NAME })
    expect(localStorage.getItem(SAVE_DELETE_NOTEBOOK_NAME)).toEqual(null)
  })
})
