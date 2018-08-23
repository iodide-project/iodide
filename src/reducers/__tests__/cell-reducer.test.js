import '../../store'
import cellReducer from '../cell-reducer'
import { newNotebook } from '../../editor-state-prototypes'

describe('add cells', () => {
  const state = newNotebook()
  const nextState = cellReducer(state, { type: 'ADD_CELL', cellType: 'code' })
  it('should add a cell to the end of the current notebook', () => {
    expect(nextState.cells.length).toEqual(newNotebook().cells.length + 1)
    expect(nextState.cells[nextState.cells.length - 1].cellType).toEqual('code')
  })
})
