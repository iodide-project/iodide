import {reducer, newBlankState} from './../src/reducer.jsx'
import actions from './../src/actions.jsx'

describe('post-reducer', ()=>{
    it('should return the initial state', ()=>{
        expect(reducer(undefined,newBlankState())).toEqual(newBlankState())
    })
})