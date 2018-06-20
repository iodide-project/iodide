import notebookReducer from '../notebook-reducer'
import { newNotebook, blankState, addNewCellToState } from '../../state-prototypes'

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

})
