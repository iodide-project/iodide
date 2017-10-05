import cell from './../src/reducers/cell-reducer'
import * as NB from './../src/notebook-utils'
import actions                 from './../src/actions'


describe('add cells', ()=>{
    var state = NB.newNotebook()
    var nextState = cell(state, {type: 'ADD_CELL', cellType: 'javascript'})
    it('should add a cell to the end of the current notebook', ()=> {
        expect(nextState.cells.length).toEqual(NB.newNotebook().cells.length+1)
        expect(nextState.cells[nextState.cells.length-1].cellType).toEqual('javascript')
    })
})

// describe('insert cells', ()=> {
//     var state = NB.newNotebook()
//     var nextState = cell()
// })