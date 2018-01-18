import notebookReducer from '../src/reducers/notebook-reducer'
import localStorageMock from './mockLocalStorage'
import { newNotebook, blankState, newCell } from '../src/state-prototypes.js'
import * as utils from '../src/state-prototypes'


window.localStorage = localStorageMock

const EXAMPLE_NOTEBOOK_1 = 'example notebook with content'

function exampleNotebookWithContent(title=EXAMPLE_NOTEBOOK_1) {
  let state = utils.newNotebook()
  state.cells.push(newCell(state.cells, 'javascript'))
  state.cells.push(newCell(state.cells, 'markdown'))
  state.cells[0].selected = true
  state.title = title
  // utils.addCell(state.cells, 'javascript')
  // utils.addCell(state.cells, 'markdown')
  // utils.selectCell(state.cells, state.cells[0].id)
  // utils.changeTitle(state, title)
  return state
}


describe('blank-state-reducer', ()=>{
  it('should return the initial state', ()=>{
    expect(notebookReducer(blankState(), {})).toEqual(blankState())
  })
})

describe('new notebooks', ()=>{
  let nextState = utils.newNotebook()

  it('should create newNotebook() on NEW_NOTEBOOK', ()=>{
    expect(notebookReducer(nextState, {type:'NEW_NOTEBOOK'})).toEqual(newNotebook())
  })

})

describe('misc. notebook operations that don\'t belong elsewhere', ()=> {
  let state = exampleNotebookWithContent()
  let NEW_NAME = 'changed notebook name'
  it('should change title', ()=>{
    expect(notebookReducer(state, {type:'CHANGE_PAGE_TITLE', title: NEW_NAME}).title).toEqual(NEW_NAME)
  })
})

describe('importing a notebook via state', ()=> {
  let state = newNotebook()
  let nextState = exampleNotebookWithContent()

  it('should import a notebook correctly on IMPORT_NOTEBOOK', ()=>{
    expect(notebookReducer(state, {type: 'IMPORT_NOTEBOOK', newState: nextState})).toEqual(nextState)
  })
})

describe('saving / deleting localStorage-saved notebooks', ()=>{
  // this will do enough for now.

  let SAVE_DELETE_NOTEBOOK_NAME = 'save-delete-notebook-tests'
  let state = exampleNotebookWithContent(SAVE_DELETE_NOTEBOOK_NAME)

  it('should save via SAVE_NOTEBOOK',()=>{
    notebookReducer(state, {type: 'SAVE_NOTEBOOK'})

    let savedNotebook = JSON.parse(window.localStorage.getItem(SAVE_DELETE_NOTEBOOK_NAME))
    expect(savedNotebook.title).toEqual(state.title)
    expect(savedNotebook.lastSaved).toBeDefined()
    expect(savedNotebook.cells).toEqual(state.cells)
  })

  it('should delete via DELETE_NOTEBOOK', ()=> {
    notebookReducer(state, {type: 'DELETE_NOTEBOOK', title: SAVE_DELETE_NOTEBOOK_NAME})
    expect(window.localStorage.getItem(SAVE_DELETE_NOTEBOOK_NAME)).toEqual(undefined)
  })
})
