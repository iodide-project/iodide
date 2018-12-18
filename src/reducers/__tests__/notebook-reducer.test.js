import '../../store'
import notebookReducer from '../notebook-reducer'
import { newNotebook } from '../../editor-state-prototypes'

// FIXME: re-implement tests for the notebook reducer

const EXAMPLE_NOTEBOOK_1 = 'example notebook with content'

function exampleNotebookWithContent(title = EXAMPLE_NOTEBOOK_1) {
  const state = newNotebook()
  state.jsmd = `%% js
var x = 10

%% md 

# title element
`
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

// describe('replacing notebook content', () => {
//   const state = newNotebook()
//   const actionPayload = { cells: [newCell(0, 'code')], title: 'my cool title' }
//   const expectedNextState = Object.assign(state, actionPayload)

//   it('should replace content', () => {
//     expect(notebookReducer(state, { type: 'REPLACE_NOTEBOOK_CONTENT', ...actionPayload }))
//       .toEqual(expectedNextState)
//   })
// })
