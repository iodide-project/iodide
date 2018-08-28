import '../../store'
import notebookReducer from '../notebook-reducer'
import { newNotebook, newCell } from '../../editor-state-prototypes'

const EXAMPLE_NOTEBOOK_1 = 'example notebook with content'

function exampleNotebookWithContent(title = EXAMPLE_NOTEBOOK_1) {
  const state = newNotebook()
  state.cells.push(newCell(0, 'code'))
  state.cells.push(newCell(1, 'markdown'))
  state.cells[0].selected = true
  state.title = title
  return state
}

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
