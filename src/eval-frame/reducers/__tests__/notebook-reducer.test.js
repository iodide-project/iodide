import notebookReducer from '../notebook-reducer'
import { newNotebook, blankState } from '../../state-prototypes'

describe('blank-state-reducer', () => {
  it('should return the initial state', () => {
    expect(notebookReducer(blankState(), {})).toEqual(blankState())
  })
})

describe('new notebooks', () => {
  const nextState = newNotebook()

  it('should create newNotebook() on NEW_NOTEBOOK', () => {
    expect(notebookReducer(nextState, { type: 'NEW_NOTEBOOK' })).toEqual(newNotebook())
  })
})

