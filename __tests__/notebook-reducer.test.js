import notebook                from './../src/reducers/notebook-reducer'
import { blankState, newNotebook, newCell } from './../src/reducers/blank-state'
import actions                 from './../src/actions'
import localStorageMock from './../__mocks__/localStorage'

window.localStorage = localStorageMock

describe('blank-state-reducer', ()=>{
    it('should return the initial state', ()=>{
        expect(notebook(blankState(), {})).toEqual(blankState())
    })
})

describe('new-notebook-reducer', ()=>{
    var state = newNotebook()
    var nextState = Object.assign({}, state)
    nextState.cells.push(newCell(nextState, 'javascript'))
    nextState.cells.push(newCell(nextState, 'markdown'))
    nextState.cells[0].selected = true

    it('should create newNotebook() on NEW_NOTEBOOK', ()=>{
        expect(notebook(nextState, {type:'NEW_NOTEBOOK'})).toEqual(newNotebook())
    })
    it('should import a notebook correctly on IMPORT_NOTEBOOK', ()=>{
        expect(notebook(state, {type: 'IMPORT_NOTEBOOK', newState: nextState})).toEqual(nextState)
    })

    it('should save via SAVE_NOTEBOOK',()=>{
        var state = newNotebook()

        expect(notebook(, ))
    })
})