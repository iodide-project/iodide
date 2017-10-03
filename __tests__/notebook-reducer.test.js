import notebook                from './../src/reducers/notebook-reducer'
import * as utils from './../src/notebook-utils'
import actions                 from './../src/actions'
import localStorageMock from './../__mocks__/localStorage'
window.localStorage = localStorageMock

const EXAMPLE_NOTEBOOK_1 = 'example notebook with content'

function exampleNotebookWithContent(title=EXAMPLE_NOTEBOOK_1) {
    var state = utils.newNotebook()

    utils.addCell(state.cells, 'javascript')
    utils.addCell(state.cells, 'markdown')
    utils.selectCell(state.cells, state.cells[0].id)
    utils.changeTitle(state, title)
    return state
}


describe('blank-state-reducer', ()=>{
    it('should return the initial state', ()=>{
        expect(notebook(utils.blankState(), {})).toEqual(utils.blankState())
    })
})

describe('new notebooks', ()=>{
    var nextState = utils.newNotebook()

    it('should create newNotebook() on NEW_NOTEBOOK', ()=>{
        expect(notebook(nextState, {type:'NEW_NOTEBOOK'})).toEqual(utils.newNotebook())
    })

})

describe('misc. notebook operations that don\'t belong elsewhere', ()=> {
    var state = exampleNotebookWithContent()
    var NEW_NAME = 'changed notebook name'
    it('should change title', ()=>{
        expect(notebook(state, {type:'CHANGE_PAGE_TITLE', title: NEW_NAME}).title).toEqual(NEW_NAME)
    })
})

describe('importing a notebook via state', ()=> {
    var state = utils.newNotebook()
    var nextState = exampleNotebookWithContent()

    it('should import a notebook correctly on IMPORT_NOTEBOOK', ()=>{
        expect(notebook(state, {type: 'IMPORT_NOTEBOOK', newState: nextState})).toEqual(nextState)
    })
})

describe('saving / deleting localStorage-saved notebooks', ()=>{
    // this will do enough for now.

    var SAVE_DELETE_NOTEBOOK_NAME = 'save-delete-notebook-tests'
    var state = exampleNotebookWithContent(SAVE_DELETE_NOTEBOOK_NAME)
    
    it('should save via SAVE_NOTEBOOK',()=>{
        notebook(state, {type: 'SAVE_NOTEBOOK'})

        var savedNotebook = JSON.parse(window.localStorage.getItem(SAVE_DELETE_NOTEBOOK_NAME))
        expect(savedNotebook.title).toEqual(state.title)
        expect(savedNotebook.lastSaved).toBeDefined()
        expect(savedNotebook.cells).toEqual(state.cells)
    })

    it('should delete via DELETE_NOTEBOOK', ()=> {
        notebook(state, {type: 'DELETE_NOTEBOOK', title: SAVE_DELETE_NOTEBOOK_NAME})        
        expect(window.localStorage.getItem(SAVE_DELETE_NOTEBOOK_NAME)).toEqual(undefined)
    })
})