import cellReducer from '../src/reducers/cell-reducer'
import * as NB from '../src/notebook-utils'
import { newNotebook } from './../src/state-prototypes'

describe('add cells', ()=>{
  let state = newNotebook()
  let nextState = cellReducer(state, {type: 'ADD_CELL', cellType: 'javascript'})
  it('should add a cell to the end of the current notebook', ()=> {
    expect(nextState.cells.length).toEqual(newNotebook().cells.length+1)
    expect(nextState.cells[nextState.cells.length-1].cellType).toEqual('javascript')
  })
})

// describe('insert cells', ()=> {
//     var state = NB.newNotebook()
//     var nextState = cell()
// })