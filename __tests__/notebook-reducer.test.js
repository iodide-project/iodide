import notebook                from './../src/reducers/notebook-reducer'
import { blankState, newCell } from './../src/reducers/blank-state'
import actions                 from './../src/actions'

describe('blank-state-reducer', ()=>{
    it('should return the initial state', ()=>{
        expect(notebook(blankState(), {})).toEqual(blankState())
    })
})